import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import waterNormalsSrc from "../assets/waternormals.jpg";
import {
  getScrollFrameSnapshot,
  subscribeToScrollFrame,
} from "../scrollPipeline";

const WATER_COLOR = 0x8fdcff;
const CAMERA_NEAR = 1;
const CAMERA_FAR = 9000;
const WATER_EXTENT = 5200;
const WATER_FORWARD_OFFSET = -1100;
const MOBILE_DPR_LIMIT = 1;
const DESKTOP_DPR_LIMIT = 1.35;
const MOBILE_WATER_TEXTURE_SIZE = 224;
const DESKTOP_WATER_TEXTURE_SIZE = 384;
const MOBILE_WATER_DISTORTION_SCALE = 0.9;
const DESKTOP_WATER_DISTORTION_SCALE = 1.1;

type CompositionPreset = {
  isMobile: boolean;
  camera: {
    fov: number;
    x: number;
    y: number;
    z: number;
    lookAtY: number;
    scrollY: number;
    scrollZ: number;
  };
};

const freezeTransform = (object: THREE.Object3D) => {
  object.matrixAutoUpdate = false;
  object.updateMatrix();
};

const getDprLimit = (isMobile: boolean, reduceMotion: boolean) => {
  if (reduceMotion) {
    return 1;
  }

  return isMobile ? MOBILE_DPR_LIMIT : DESKTOP_DPR_LIMIT;
};

const getWaterTextureSize = (isMobile: boolean) =>
  isMobile ? MOBILE_WATER_TEXTURE_SIZE : DESKTOP_WATER_TEXTURE_SIZE;

const getWaterDistortionScale = (isMobile: boolean) =>
  isMobile ? MOBILE_WATER_DISTORTION_SCALE : DESKTOP_WATER_DISTORTION_SCALE;

const getCompositionPreset = (
  width: number,
  height: number,
): CompositionPreset => {
  const isMobile = width <= 900;
  const isTallMobile = isMobile && height / Math.max(1, width) > 1.55;

  if (isTallMobile) {
    return {
      isMobile: true,
      camera: {
        fov: 58,
        x: 0,
        y: 36,
        z: 26,
        lookAtY: 0,
        scrollY: 1.35,
        scrollZ: 0.45,
      },
    };
  }

  if (isMobile) {
    return {
      isMobile: true,
      camera: {
        fov: 56,
        x: 0,
        y: 34,
        z: 28,
        lookAtY: 0.4,
        scrollY: 1.45,
        scrollZ: 0.52,
      },
    };
  }

  return {
    isMobile: false,
    camera: {
      fov: 44,
      x: 0,
      y: 38,
      z: 34,
      lookAtY: 2,
      scrollY: 1.8,
      scrollZ: 0.75,
    },
  };
};

type OceanWebGLBackgroundProps = {
  isActive?: boolean;
};

const canUseWebGL = () => {
  const probe = document.createElement("canvas");

  return (
    !!probe.getContext("webgl2", { alpha: true }) ||
    !!probe.getContext("webgl", { alpha: true }) ||
    !!probe.getContext("experimental-webgl", { alpha: true })
  );
};

export const OceanWebGLBackground = ({
  isActive = true,
}: OceanWebGLBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      return;
    }

    if (!canUseWebGL()) {
      return;
    }

    let composition = getCompositionPreset(
      window.innerWidth,
      window.innerHeight,
    );
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    const isMobile = composition.isMobile;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let dprLimit = getDprLimit(isMobile, reduceMotion);
    const baseDpr = Math.min(window.devicePixelRatio || 1, dprLimit);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(baseDpr);
    renderer.setSize(viewportWidth, viewportHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isMobile ? 0.72 : 0.68;
    renderer.setClearColor(WATER_COLOR, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(WATER_COLOR);
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x8fdcff, 1.12);
    scene.add(ambientLight);
    freezeTransform(ambientLight);

    const camera = new THREE.PerspectiveCamera(
      composition.camera.fov,
      viewportWidth / viewportHeight,
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    camera.position.set(
      composition.camera.x,
      composition.camera.y,
      composition.camera.z,
    );
    camera.lookAt(0, composition.camera.lookAtY, 0);

    const textureLoader = new THREE.TextureLoader();
    const waterNormals = textureLoader.load(waterNormalsSrc);
    waterNormals.wrapS = THREE.RepeatWrapping;
    waterNormals.wrapT = THREE.RepeatWrapping;
    waterNormals.minFilter = THREE.LinearMipmapLinearFilter;
    waterNormals.magFilter = THREE.LinearFilter;

    const waterGeometry = new THREE.PlaneGeometry(WATER_EXTENT, WATER_EXTENT);
    const water = new Water(waterGeometry, {
      textureWidth: getWaterTextureSize(isMobile),
      textureHeight: getWaterTextureSize(isMobile),
      waterNormals,
      sunDirection: new THREE.Vector3(0.14, 0.96, -0.24).normalize(),
      sunColor: 0xf2fbff,
      waterColor: WATER_COLOR,
      distortionScale: getWaterDistortionScale(isMobile),
      fog: false,
      alpha: 1,
    });
    water.rotation.x = -Math.PI / 2;
    // Bias the water plane forward because the camera never rotates behind itself.
    // This keeps most geometry in front of the view without changing the horizon.
    water.position.z = WATER_FORWARD_OFFSET;
    scene.add(water);
    freezeTransform(water);

    const waterUniforms = water.material.uniforms as Record<
      string,
      THREE.IUniform
    >;
    (waterUniforms.sunDirection.value as THREE.Vector3)
      .set(0.14, 0.96, -0.24)
      .normalize();
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDestroyed = false;

    let lastCameraY = Number.NaN;
    let lastCameraZ = Number.NaN;

    const syncCameraPose = (scrollSmooth: number) => {
      const nextCameraY =
        composition.camera.y - scrollSmooth * composition.camera.scrollY;
      const nextCameraZ =
        composition.camera.z - scrollSmooth * composition.camera.scrollZ;

      if (nextCameraY === lastCameraY && nextCameraZ === lastCameraZ) {
        return;
      }

      camera.position.set(composition.camera.x, nextCameraY, nextCameraZ);
      camera.lookAt(0, composition.camera.lookAtY, 0);
      lastCameraY = nextCameraY;
      lastCameraZ = nextCameraZ;
    };

    syncCameraPose(0);

    let sharedScrollProgress = reduceMotion
      ? 0
      : getScrollFrameSnapshot().smoothedProgress;
    const unsubscribeScroll = subscribeToScrollFrame((snapshot) => {
      sharedScrollProgress = reduceMotion ? 0 : snapshot.smoothedProgress;
    });

    const renderFrame = () => {
      frameId = 0;
      if (isDestroyed || document.hidden) {
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      syncCameraPose(sharedScrollProgress);

      if (!reduceMotion) {
        const currentTime = waterUniforms.time.value as number;
        waterUniforms.time.value = currentTime + delta * 0.42;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      frameId = window.requestAnimationFrame(renderFrame);
    }

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      viewportWidth = width;
      viewportHeight = height;
      composition = getCompositionPreset(width, height);
      dprLimit = getDprLimit(composition.isMobile, reduceMotion);
      renderer.setSize(width, height, false);
      renderer.toneMappingExposure = composition.isMobile ? 0.72 : 0.68;
      camera.fov = composition.camera.fov;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      lastCameraY = Number.NaN;
      lastCameraZ = Number.NaN;
      syncCameraPose(sharedScrollProgress);

      const nextDpr = Math.min(window.devicePixelRatio || 1, dprLimit);
      renderer.setPixelRatio(nextDpr);
    };

    window.addEventListener("resize", onResize, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) {
        renderer.setPixelRatio(Math.min(1, baseDpr));
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprLimit));
      if (!frameId && !reduceMotion) {
        clock.getDelta();
        frameId = window.requestAnimationFrame(renderFrame);
      } else if (reduceMotion) {
        syncCameraPose(sharedScrollProgress);
        renderer.render(scene, camera);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });

    return () => {
      isDestroyed = true;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      unsubscribeScroll();

      waterGeometry.dispose();
      water.material.dispose();
      waterNormals.dispose();
      renderer.dispose();
    };
  }, [isActive]);

  return <canvas id="ocean-gl" ref={canvasRef} aria-hidden="true" />;
};
