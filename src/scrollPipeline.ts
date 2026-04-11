export type ScrollFrameSnapshot = {
  rawY: number;
  smoothedY: number;
  maxScroll: number;
  rawProgress: number;
  smoothedProgress: number;
  activeScene: string | null;
  isScrolling: boolean;
};

type ScrollListener = (snapshot: ScrollFrameSnapshot) => void;

type SceneMetric = {
  element: HTMLElement;
  name: string | null;
  top: number;
  duration: number;
  isProgram: boolean;
};

type SceneState = {
  metric: SceneMetric;
  rawProgress: number;
  progress: number;
  displayProgress: number;
  activeConfidence: number;
};

type StartScrollPipelineOptions = {
  root: HTMLElement;
  scenes: HTMLElement[];
  onProgramProgress?: (progress: number) => void;
};

const MOBILE_BREAKPOINT = 900;
const STOP_DELTA_PX = 0.35;
const PROGRAM_PROGRESS_DEAD_ZONE = 0.018;
const SCENE_NEAR_ENTER_MIN = -0.28;
const SCENE_NEAR_ENTER_MAX = 1.28;
const SCENE_NEAR_EXIT_MIN = -0.38;
const SCENE_NEAR_EXIT_MAX = 1.38;
const SCENE_ACTIVE_ENTER_MIN = 0.08;
const SCENE_ACTIVE_ENTER_MAX = 0.92;
const SCENE_ACTIVE_EXIT_MIN = -0.14;
const SCENE_ACTIVE_EXIT_MAX = 1.14;
const ACTIVE_SWITCH_MARGIN_MOBILE = 0.02;
const ACTIVE_SWITCH_MARGIN_DESKTOP = 0.035;
const SMOOTHING_BASE_MOBILE = 14;
const SMOOTHING_BASE_DESKTOP = 11;
const SMOOTHING_BOOST_MOBILE = 18;
const SMOOTHING_BOOST_DESKTOP = 14;

const defaultSnapshot: ScrollFrameSnapshot = {
  rawY: 0,
  smoothedY: 0,
  maxScroll: 1,
  rawProgress: 0,
  smoothedProgress: 0,
  activeScene: null,
  isScrolling: false,
};

let snapshot = defaultSnapshot;
const listeners = new Set<ScrollListener>();

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getScrollMax = () =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

const applyBoundaryDeadZone = (progress: number, deadZone: number) => {
  if (deadZone <= 0) {
    return clamp01(progress);
  }

  if (progress <= deadZone) {
    return 0;
  }

  if (progress >= 1 - deadZone) {
    return 1;
  }

  return (progress - deadZone) / (1 - deadZone * 2);
};

const getSceneActiveConfidence = (rawProgress: number) => {
  if (
    rawProgress <= SCENE_ACTIVE_EXIT_MIN ||
    rawProgress >= SCENE_ACTIVE_EXIT_MAX
  ) {
    return 0;
  }

  return clamp01(1 - Math.abs(rawProgress - 0.5) / 0.5);
};

const getActiveSceneName = (scene: HTMLElement) =>
  Array.from(scene.classList).find((className) =>
    className.startsWith("scene--"),
  ) ?? null;

const getViewportHeight = () => window.innerHeight;

const publishSnapshot = (nextSnapshot: ScrollFrameSnapshot) => {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener(snapshot));
};

export const getScrollFrameSnapshot = () => snapshot;

export const subscribeToScrollFrame = (listener: ScrollListener) => {
  listeners.add(listener);
  listener(snapshot);

  return () => {
    listeners.delete(listener);
  };
};

export const startScrollPipeline = ({
  root,
  scenes,
  onProgramProgress,
}: StartScrollPipelineOptions) => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!scenes.length) {
    publishSnapshot(defaultSnapshot);
    return () => {
      publishSnapshot(defaultSnapshot);
    };
  }

  let frameId = 0;
  let resizeObserver: ResizeObserver | null = null;
  let sceneMetrics: SceneMetric[] = [];
  let maxScroll = getScrollMax();
  let targetY = window.scrollY;
  let smoothedY = targetY;
  let lastFrameAt = performance.now();
  let needsMeasure = true;
  let committedActiveIndex = -1;
  let committedNearFlags = scenes.map(() => false);

  const getSmoothingAlpha = (distance: number, deltaMs: number) => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const base = isMobile ? SMOOTHING_BASE_MOBILE : SMOOTHING_BASE_DESKTOP;
    const boost = isMobile ? SMOOTHING_BOOST_MOBILE : SMOOTHING_BOOST_DESKTOP;
    const distanceRatio = Math.min(
      1,
      distance / Math.max(1, getViewportHeight()),
    );
    const response = base + boost * distanceRatio;
    return 1 - Math.exp(-(deltaMs / 1000) * response);
  };

  const measureScenes = () => {
    const viewportHeight = getViewportHeight();
    sceneMetrics = scenes.map((scene) => ({
      element: scene,
      name: getActiveSceneName(scene),
      top: scene.offsetTop,
      duration: Math.max(1, scene.offsetHeight - viewportHeight),
      isProgram: scene.classList.contains("scene--program"),
    }));
    maxScroll = getScrollMax();
    needsMeasure = false;
  };

  const deriveSceneStates = (scrollY: number): SceneState[] => {
    if (needsMeasure || !sceneMetrics.length) {
      measureScenes();
    }

    return sceneMetrics.map((metric) => {
      const rawProgress = (scrollY - metric.top) / metric.duration;
      const progress = clamp01(rawProgress);

      return {
        metric,
        rawProgress,
        progress,
        displayProgress: metric.isProgram
          ? applyBoundaryDeadZone(progress, PROGRAM_PROGRESS_DEAD_ZONE)
          : progress,
        activeConfidence: getSceneActiveConfidence(rawProgress),
      };
    });
  };

  const applySceneProgress = (sceneStates: SceneState[]) => {
    sceneStates.forEach((sceneState) => {
      sceneState.metric.element.style.setProperty(
        "--scene-progress",
        sceneState.progress.toFixed(4),
      );

      if (sceneState.metric.isProgram) {
        onProgramProgress?.(sceneState.displayProgress);
      }
    });
  };

  const getCandidateActiveIndex = (sceneStates: SceneState[]) => {
    let candidateIndex = -1;
    let candidateConfidence = 0;

    sceneStates.forEach((sceneState, index) => {
      if (sceneState.activeConfidence <= candidateConfidence) {
        return;
      }

      candidateIndex = index;
      candidateConfidence = sceneState.activeConfidence;
    });

    return candidateIndex;
  };

  const commitSceneClasses = (sceneStates: SceneState[]) => {
    const candidateIndex = getCandidateActiveIndex(sceneStates);
    const currentState =
      committedActiveIndex >= 0 ? sceneStates[committedActiveIndex] : null;
    const candidateState =
      candidateIndex >= 0 ? sceneStates[candidateIndex] : null;
    const switchMargin =
      window.innerWidth <= MOBILE_BREAKPOINT
        ? ACTIVE_SWITCH_MARGIN_MOBILE
        : ACTIVE_SWITCH_MARGIN_DESKTOP;

    let nextActiveIndex = -1;

    if (
      currentState &&
      currentState.rawProgress > SCENE_ACTIVE_EXIT_MIN &&
      currentState.rawProgress < SCENE_ACTIVE_EXIT_MAX
    ) {
      nextActiveIndex = committedActiveIndex;
    }

    if (
      candidateState &&
      candidateState.rawProgress > SCENE_ACTIVE_ENTER_MIN &&
      candidateState.rawProgress < SCENE_ACTIVE_ENTER_MAX
    ) {
      const currentConfidence = currentState?.activeConfidence ?? 0;

      if (
        nextActiveIndex === -1 ||
        candidateIndex === committedActiveIndex ||
        candidateState.activeConfidence >= currentConfidence + switchMargin
      ) {
        nextActiveIndex = candidateIndex;
      }
    }

    const nextNearFlags = sceneStates.map((sceneState, index) => {
      const wasNear = committedNearFlags[index];
      return wasNear
        ? sceneState.rawProgress > SCENE_NEAR_EXIT_MIN &&
            sceneState.rawProgress < SCENE_NEAR_EXIT_MAX
        : sceneState.rawProgress > SCENE_NEAR_ENTER_MIN &&
            sceneState.rawProgress < SCENE_NEAR_ENTER_MAX;
    });

    sceneStates.forEach((sceneState, index) => {
      sceneState.metric.element.classList.toggle(
        "is-active",
        index === nextActiveIndex,
      );
      sceneState.metric.element.classList.toggle("is-near", nextNearFlags[index]);
    });

    committedActiveIndex = nextActiveIndex;
    committedNearFlags = nextNearFlags;

    const activeSceneName =
      nextActiveIndex >= 0 ? sceneStates[nextActiveIndex]?.metric.name ?? null : null;
    root.dataset.activeScene = activeSceneName ?? "";

    return activeSceneName;
  };

  const syncReducedMotion = () => {
    maxScroll = getScrollMax();
    targetY = window.scrollY;
    smoothedY = targetY;
    scenes.forEach((scene) => {
      scene.style.setProperty("--scene-progress", "1");
      scene.classList.remove("is-active", "is-near");
    });
    onProgramProgress?.(1);
    root.dataset.activeScene = "";

    publishSnapshot({
      rawY: targetY,
      smoothedY: smoothedY,
      maxScroll,
      rawProgress: clamp01(targetY / maxScroll),
      smoothedProgress: clamp01(smoothedY / maxScroll),
      activeScene: null,
      isScrolling: false,
    });
  };

  const renderFrame = (frameNow: number) => {
    frameId = 0;

    if (needsMeasure) {
      measureScenes();
    }

    const deltaMs = Math.max(1, frameNow - lastFrameAt);
    lastFrameAt = frameNow;

    const distance = targetY - smoothedY;
    if (Math.abs(distance) <= STOP_DELTA_PX) {
      smoothedY = targetY;
    } else {
      smoothedY += distance * getSmoothingAlpha(Math.abs(distance), deltaMs);
    }

    const sceneStates = deriveSceneStates(targetY);
    applySceneProgress(sceneStates);
    const activeScene = commitSceneClasses(sceneStates);
    const isScrolling = Math.abs(targetY - smoothedY) > STOP_DELTA_PX;

    publishSnapshot({
      rawY: targetY,
      smoothedY,
      maxScroll,
      rawProgress: clamp01(targetY / maxScroll),
      smoothedProgress: clamp01(smoothedY / maxScroll),
      activeScene,
      isScrolling,
    });

    if (isScrolling || needsMeasure) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
  };

  const requestFrame = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(renderFrame);
  };

  const onScroll = () => {
    targetY = window.scrollY;
    requestFrame();
  };

  const syncNow = () => {
    maxScroll = getScrollMax();
    targetY = window.scrollY;
    smoothedY = targetY;
    lastFrameAt = performance.now();
    needsMeasure = true;

    if (reduceMotion) {
      syncReducedMotion();
      return;
    }

    const sceneStates = deriveSceneStates(targetY);
    applySceneProgress(sceneStates);
    const activeScene = commitSceneClasses(sceneStates);

    publishSnapshot({
      rawY: targetY,
      smoothedY,
      maxScroll,
      rawProgress: clamp01(targetY / maxScroll),
      smoothedProgress: clamp01(smoothedY / maxScroll),
      activeScene,
      isScrolling: false,
    });
  };

  syncNow();

  if (!reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const onResize = () => {
    needsMeasure = true;
    targetY = window.scrollY;

    if (reduceMotion) {
      syncReducedMotion();
      return;
    }

    requestFrame();
  };

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize);

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(document.documentElement);
    scenes.forEach((scene) => resizeObserver?.observe(scene));
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      return;
    }

    onResize();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }

    resizeObserver?.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    root.removeAttribute("data-active-scene");

    scenes.forEach((scene) => {
      scene.classList.remove("is-active", "is-near");
      scene.style.removeProperty("--scene-progress");
    });

    publishSnapshot(defaultSnapshot);
  };
};
