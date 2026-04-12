import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { EngagementGallerySection } from "./components/EngagementGallerySection";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { ImageWithSkeleton } from "./components/ImageWithSkeleton";
import { KissMeSection } from "./components/KissMeSection";
import { Lightbox } from "./components/Lightbox";
import { OceanWebGLBackground } from "./components/OceanWebGLBackground";
import { PaperFlower } from "./components/PaperFlower";
import { WeddingCountdownSection } from "./components/WeddingCountdownSection";
import { WeddingDetailsSection } from "./components/WeddingDetailsSection";
import { invitationContent } from "./config/invitationContent";
import { engagementPhotos } from "./data/engagementPhotos";
import {
  isRsvpGoogleFormConfigured,
  rsvpGoogleForm,
} from "./config/rsvpGoogleForm";
import { startScrollPipeline } from "./scrollPipeline";

const PROGRAM_PATH_START_PROGRESS = 0.03;
const PROGRAM_PATH_PROGRESS_SPAN = 0.97;
const PROGRAM_HEART_SIZE = 72;
const PROGRAM_PATH_VIEWBOX_WIDTH = 240;
const PROGRAM_PATH_VIEWBOX_HEIGHT = 780;
const RSVP_SUBMIT_TARGET = "rsvp-google-form-submit-target";
const AUDIO_START_OFFSET_SECONDS = 0.9;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const revealStyle = (delay: number): CSSProperties =>
  ({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

const sceneDepthStyle = (depthVh: number): CSSProperties =>
  ({ "--scene-depth": `${depthVh}vh` }) as CSSProperties;

const dresscodeLookSizeClass = (index: number) => {
  const layout = [
    "s",
    "m",
    "m",
    "m",
    "l",
    "m",
    "m",
    "s",
    "m",
    "m",
    "m",
    "m",
    "l",
    "m",
  ] as const;

  return layout[index % layout.length];
};

const dresscodePaletteFlowers = [
  {
    name: "Royal",
    code: "#334EAC",
    petalColor: "#334EAC",
    centerColor: "#EDF1F6",
    outlineColor: "rgba(33, 58, 111, 0.18)",
    tone: "dark",
    rotate: -8,
    turns: 1.2,
  },
  {
    name: "Beige",
    code: "#F5F5DC",
    petalColor: "#F5F5DC",
    centerColor: "#7096D1",
    outlineColor: "rgba(109, 134, 170, 0.72)",
    tone: "light",
    rotate: 6,
    turns: -1.1,
  },
  {
    name: "China",
    code: "#7096D1",
    petalColor: "#7096D1",
    centerColor: "#F7F2EB",
    outlineColor: "rgba(33, 58, 111, 0.18)",
    tone: "dark",
    rotate: -4,
    turns: 1.35,
  },
  {
    name: "Asian Pear",
    code: "#F2F0DE",
    petalColor: "#F2F0DE",
    centerColor: "#BAD6EB",
    outlineColor: "rgba(109, 134, 170, 0.72)",
    tone: "light",
    rotate: 10,
    turns: -1.4,
  },
  {
    name: "Midnight",
    code: "#081F5C",
    petalColor: "#081F5C",
    centerColor: "#D0E3FF",
    outlineColor: "rgba(33, 58, 111, 0.18)",
    tone: "dark",
    rotate: -12,
    turns: 1.25,
  },
  {
    name: "Dawn",
    code: "#D0E3FF",
    petalColor: "#D0E3FF",
    centerColor: "#7096D1",
    outlineColor: "rgba(109, 134, 170, 0.72)",
    tone: "light",
    rotate: 5,
    turns: -1.15,
  },
  {
    name: "Glacier",
    code: "#00BFFF",
    petalColor: "#00BFFF",
    centerColor: "#334EAC",
    outlineColor: "rgba(109, 134, 170, 0.72)",
    tone: "light",
    rotate: -10,
    turns: 1.1,
  },
  {
    name: "Sky",
    code: "#BAD6EB",
    petalColor: "#BAD6EB",
    centerColor: "#081F5C",
    outlineColor: "rgba(33, 58, 111, 0.18)",
    tone: "dark",
    rotate: -6,
    turns: 1.3,
  },
] as const;

const dresscodePaletteRows = [
  {
    tone: "dark",
    flowers: dresscodePaletteFlowers.filter((flower) => flower.tone === "dark"),
  },
  {
    tone: "light",
    flowers: dresscodePaletteFlowers.filter(
      (flower) => flower.tone === "light",
    ),
  },
] as const;

const dresscodePaletteFlowerStyle = (
  flower: (typeof dresscodePaletteFlowers)[number],
): CSSProperties =>
  ({
    "--dresscode-petal-color": flower.petalColor,
    "--dresscode-center-color": flower.centerColor,
    "--dresscode-outline-color": flower.outlineColor,
    "--dresscode-palette-rotate": `${flower.rotate}deg`,
    "--dresscode-palette-turns": `${flower.turns}turn`,
  }) as CSSProperties;

const getFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const getFormValues = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

const getSelectValueLabel = (
  form: HTMLFormElement,
  fieldName: string,
  fallbackValue: string,
) => {
  const field = form.elements.namedItem(fieldName);

  if (!(field instanceof HTMLSelectElement)) {
    return fallbackValue;
  }

  return field.selectedOptions[0]?.label?.trim() || fallbackValue;
};

const getRussianValidationMessage = (
  field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) => {
  if (field.validity.valueMissing) {
    return field.name === "attending"
      ? "Пожалуйста, выберите вариант."
      : field.name === "drinkPreferences"
        ? "Пожалуйста, выберите хотя бы один вариант."
      : "Пожалуйста, заполните это поле.";
  }

  return "";
};

const syncDrinkPreferencesValidation = (
  form: HTMLFormElement | null,
  shouldShowError = false,
) => {
  const inputs =
    form?.querySelectorAll<HTMLInputElement>('input[name="drinkPreferences"]') ??
    [];
  const checkedCount = Array.from(inputs).filter((input) => input.checked).length;
  const hasSelection = checkedCount > 0;
  const errorMessage = "Нужно отметить хотя бы один вариант.";

  inputs.forEach((input, index) => {
    input.required = !hasSelection && index === 0;
    input.setCustomValidity(
      !hasSelection && shouldShowError && index === 0 ? errorMessage : "",
    );
  });

  return {
    hasSelection,
    firstInput: Array.from(inputs)[0] ?? null,
  };
};

const submitRsvpToGoogleForm = (payload: URLSearchParams) => {
  const form = document.createElement("form");
  form.action = rsvpGoogleForm.formAction;
  form.method = "POST";
  form.target = RSVP_SUBMIT_TARGET;
  form.style.display = "none";

  payload.forEach((value, key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

const programEventStyle = (_top: number, delay: number): CSSProperties =>
  revealStyle(delay);

const heroWordLetterStyle = ({
  top,
  left,
  scale,
  rotate,
}: {
  top: number;
  left: number;
  scale: number;
  rotate: number;
}): CSSProperties =>
  ({
    "--hero-word-top": `${top}%`,
    "--hero-word-left": `${left}%`,
    "--hero-word-scale": `${scale}`,
    "--hero-word-rotate": `${rotate}deg`,
  }) as CSSProperties;

const ProgramHeartIcon = () => (
  <svg
    className="program-heart-icon"
    viewBox="0 0 120 110"
    aria-hidden="true"
    focusable="false"
  >
    <path
      className="program-heart-shape"
      d="M60 101C47 88 18 69 10 42C4 23 14 8 31 8C43 8 53 14 60 27C67 14 77 8 89 8C106 8 116 23 110 42C102 69 73 88 60 101Z"
    />
  </svg>
);

const MusicToggleIcon = ({ isPlaying }: { isPlaying: boolean }) => (
  <svg
    className="music-toggle-icon"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <path
      className="music-toggle-speaker"
      d="M12 20h7l8-7v22l-8-7h-7z"
    />
    {isPlaying ? (
      <>
        <path
          className="music-toggle-wave"
          d="M31 18c3 2.4 4.5 5 4.5 8S34 31.6 31 34"
        />
        <path
          className="music-toggle-wave"
          d="M35 14c4.5 3.6 6.8 7.6 6.8 12S39.5 34.4 35 38"
        />
      </>
    ) : (
      <path
        className="music-toggle-off"
        d="M14 14l20 20"
      />
    )}
  </svg>
);

export const App = () => {
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [introPhase, setIntroPhase] = useState<"closed" | "opening" | "done">(
    "closed",
  );
  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isStoryPhotoOpen, setIsStoryPhotoOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAudioOffsetAppliedRef = useRef(false);
  const programPathRef = useRef<SVGPathElement | null>(null);
  const programHeartRef = useRef<HTMLDivElement | null>(null);
  const introTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const syncViewportHeight = () => {
      root.style.setProperty("--viewport-height", `${window.innerHeight}px`);
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      root.style.removeProperty("--viewport-height");
    };
  }, []);

  useEffect(() => {
    const preloadSources = [
      invitationContent.storyIntro.image.src,
      ...invitationContent.dresscode.looks.map((look) => look.src),
      ...invitationContent.storyGallery.photos.map((photo) => photo.src),
      ...engagementPhotos.flatMap((photo) => [photo.thumbSrc, photo.fullSrc]),
    ];

    const imageEntries = Array.from(new Set(preloadSources))
      .filter((asset): asset is string => !!asset)
      .map((asset) => {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        image.src = asset;
        return image;
      });

    return () => {
      imageEntries.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!hasAudioStarted || !isAudioEnabled) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => {});
  }, [hasAudioStarted, isAudioEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => {
      if (!isAudioEnabled) {
        return;
      }

      audio.currentTime = AUDIO_START_OFFSET_SECONDS;
      void audio.play().catch(() => {});
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isAudioEnabled]);

  useEffect(() => {
    if (introPhase === "done") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [introPhase]);

  useEffect(
    () => () => {
      if (introTimeoutRef.current !== null) {
        window.clearTimeout(introTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (introPhase !== "done") {
      return;
    }

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!revealElements.length) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "done") {
      return;
    }

    const root = document.documentElement;
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    if (!scenes.length) {
      return;
    }

    let pathLength = 0;
    let lastProgress = Number.NaN;

    const syncProgramHeartPosition = (progress: number) => {
      const path = programPathRef.current;
      const heart = programHeartRef.current;
      if (!path || !heart) {
        return;
      }

      if (!pathLength) {
        pathLength = path.getTotalLength();
      }

      const nextProgress = clamp01(progress);
      if (Math.abs(nextProgress - lastProgress) < 0.0005) {
        return;
      }

      const distance =
        pathLength *
        (PROGRAM_PATH_START_PROGRESS +
          nextProgress * PROGRAM_PATH_PROGRESS_SPAN);
      const point = path.getPointAtLength(distance);
      const svg = path.ownerSVGElement;
      const scaleX = svg ? svg.clientWidth / PROGRAM_PATH_VIEWBOX_WIDTH : 1;
      const scaleY = svg ? svg.clientHeight / PROGRAM_PATH_VIEWBOX_HEIGHT : 1;
      const x = point.x * scaleX - PROGRAM_HEART_SIZE / 2;
      const y = point.y * scaleY - PROGRAM_HEART_SIZE / 2;
      heart.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      lastProgress = nextProgress;
    };

    return startScrollPipeline({
      root,
      scenes,
      onProgramProgress: syncProgramHeartPosition,
    });
  }, [introPhase]);

  const storyIntroLightboxPhotos = useMemo(
    () => [
      {
        id: "story-intro-photo",
        thumbSrc: invitationContent.storyIntro.image.src,
        fullSrc: invitationContent.storyIntro.image.src,
        alt: invitationContent.storyIntro.image.alt,
        caption: "Дуров, верни стену",
        width: 522,
        height: 618,
      },
    ],
    [],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const googleFormConfigured = isRsvpGoogleFormConfigured(rsvpGoogleForm);

    setSubmitState("submitting");
    setSubmitError("");

    try {
      if (!googleFormConfigured) {
        throw new Error("google-form-config-missing");
      }

      const formData = new FormData(form);
      const attendingValue = getSelectValueLabel(
        form,
        "attending",
        getFormValue(formData, "attending"),
      );
      const drinkPreferenceValues = getFormValues(formData, "drinkPreferences");

      if (drinkPreferenceValues.length === 0) {
        const { firstInput } = syncDrinkPreferencesValidation(form, true);
        firstInput?.reportValidity();
        setSubmitState("idle");
        return;
      }

      syncDrinkPreferencesValidation(form);

      const payload = new URLSearchParams();
      payload.append(
        rsvpGoogleForm.fields.fullName,
        getFormValue(formData, "fullName"),
      );
      payload.append(rsvpGoogleForm.fields.phone, getFormValue(formData, "phone"));
      payload.append(rsvpGoogleForm.fields.attending, attendingValue);
      payload.append(
        rsvpGoogleForm.fields.favoriteTrack,
        getFormValue(formData, "favoriteTrack"),
      );

      if (rsvpGoogleForm.fields.drinkPreferences) {
        drinkPreferenceValues.forEach((value) => {
          payload.append(rsvpGoogleForm.fields.drinkPreferences!, value);
        });
      }

      payload.append(rsvpGoogleForm.fields.message, getFormValue(formData, "message"));

      submitRsvpToGoogleForm(payload);
      form.reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setSubmitError(
        googleFormConfigured
          ? invitationContent.rsvp.errorMessage
          : invitationContent.rsvp.googleFormMissingMessage,
      );
    }
  };

  const handleFieldInvalid = (
    event: React.InvalidEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.name === "drinkPreferences"
    ) {
      syncDrinkPreferencesValidation(event.currentTarget.form, true);
    }

    event.currentTarget.setCustomValidity(
      getRussianValidationMessage(event.currentTarget),
    );
  };

  const handleFieldInput = (
    event: React.FormEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.name === "drinkPreferences"
    ) {
      syncDrinkPreferencesValidation(event.currentTarget.form);
    }

    event.currentTarget.setCustomValidity("");
  };

  const handleOpenEnvelope = () => {
    if (introPhase !== "closed") {
      return;
    }

    if (audioRef.current && !hasAudioOffsetAppliedRef.current) {
      audioRef.current.currentTime = AUDIO_START_OFFSET_SECONDS;
      hasAudioOffsetAppliedRef.current = true;
    }

    setHasAudioStarted(true);
    setIsAudioEnabled(true);
    void audioRef.current?.play().catch(() => {});
    setIntroPhase("opening");
    introTimeoutRef.current = window.setTimeout(() => {
      setIntroPhase("done");
      introTimeoutRef.current = null;
    }, 1100);
  };

  const handleToggleMusic = () => {
    const nextIsEnabled = !isAudioEnabled;

    setHasAudioStarted(true);
    setIsAudioEnabled(nextIsEnabled);

    if (nextIsEnabled) {
      if (audioRef.current && !hasAudioOffsetAppliedRef.current) {
        audioRef.current.currentTime = AUDIO_START_OFFSET_SECONDS;
        hasAudioOffsetAppliedRef.current = true;
      }

      void audioRef.current?.play().catch(() => {});
      return;
    }

    audioRef.current?.pause();
  };

  return (
    <>
      <OceanWebGLBackground />
      {introPhase !== "done" ? (
        <EnvelopeIntro
          isOpening={introPhase === "opening"}
          onOpen={handleOpenEnvelope}
        />
      ) : null}
      <div className="page ocean-page">
        <iframe
          name={RSVP_SUBMIT_TARGET}
          className="rsvp-submit-frame"
          title="Скрытая отправка RSVP"
          tabIndex={-1}
          aria-hidden="true"
        />
        <audio
          ref={audioRef}
          className="music-player"
          src={invitationContent.audio.src}
          preload="metadata"
        />
        {introPhase === "done" ? (
          <button
            type="button"
            className={`music-toggle${isAudioEnabled ? " is-playing" : ""}`}
            onClick={handleToggleMusic}
            aria-label={
              isAudioEnabled ? "Выключить музыку" : "Включить музыку"
            }
            aria-pressed={isAudioEnabled}
          >
            <MusicToggleIcon isPlaying={isAudioEnabled} />
          </button>
        ) : null}

        <main className="cinema-track">
          <section
            className="scene scene--hero"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.hero)}
          >
            <div className="scene-pin">
              <header
                className={`hero section flowing-card scene-card${introPhase !== "done" ? " is-visible" : ""}`}
                data-reveal="zoom"
                style={revealStyle(80)}
              >
                <div className="hero-composition">
                  <div
                    className="hero-flower hero-flower--left"
                    aria-hidden="true"
                  >
                    <PaperFlower variant="hero" ariaHidden />
                  </div>
                  <div
                    className="hero-flower hero-flower--right"
                    aria-hidden="true"
                  >
                    <PaperFlower variant="hero" ariaHidden />
                  </div>

                  <p className="hero-kicker">
                    {invitationContent.hero.kicker}
                    <span className="hero-kicker-accent" aria-hidden="true">
                      {" =="}
                    </span>
                  </p>

                  <div className="hero-word" aria-hidden="true">
                    {invitationContent.hero.wordLetters.map((letter, index) => (
                      <span
                        key={`${letter.char}-${index}`}
                        className="hero-word-letter"
                        style={heroWordLetterStyle(letter)}
                      >
                        {letter.char}
                      </span>
                    ))}
                  </div>

                  <div className="hero-invitation">
                    <p className="hero-invitation-eyebrow">
                      {invitationContent.hero.invitationEyebrow}
                    </p>
                    <h1 className="hero-names">
                      {invitationContent.hero.invitationTitle}
                    </h1>
                    <p className="ocean-whisper hero-message">
                      {invitationContent.hero.message}
                    </p>
                  </div>
                </div>
              </header>
            </div>
          </section>

          <section
            className="scene scene--intro"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.intro)}
          >
            <div className="scene-pin">
              <article
                className="section card story-copy-card flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(120)}
              >
                <div className="story-intro-layout">
                  <div className="story-intro-copy">
                    <p className="eyebrow">
                      {invitationContent.storyIntro.eyebrow}
                    </p>
                    {invitationContent.storyIntro.title ? (
                      <h2>{invitationContent.storyIntro.title}</h2>
                    ) : null}
                    {invitationContent.storyIntro.paragraphs.map(
                      (paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ),
                    )}
                  </div>

                  <figure
                    className="story-intro-visual"
                    data-reveal="zoom"
                    style={revealStyle(220)}
                  >
                    <button
                      type="button"
                      className="story-intro-photo-button"
                      onClick={() => setIsStoryPhotoOpen(true)}
                      aria-label="Открыть фото из нашей истории"
                    >
                      <div className="story-intro-photo-shell">
                        <ImageWithSkeleton
                          wrapperClassName="story-intro-photo-media"
                          className="story-intro-photo"
                          src={invitationContent.storyIntro.image.src}
                          alt={invitationContent.storyIntro.image.alt}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </button>
                  </figure>

                  <div className="story-monogram">
                    {invitationContent.storyIntro.monogram}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section
            className="scene scene--story"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.story)}
          >
            <div className="scene-pin">
              <EngagementGallerySection
                className="section card gallery-shell flowing-card scene-card"
                eyebrow={invitationContent.storyGallery.eyebrow}
                style={revealStyle(120)}
              />
            </div>
          </section>

          <section
            className="scene scene--calendar"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.calendar)}
          >
            <div className="scene-pin">
              <article
                className="section card save-date-card flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(140)}
              >
                <p className="eyebrow">{invitationContent.saveDate.eyebrow}</p>
                <h2>{invitationContent.saveDate.title}</h2>
                <div className="save-date-grid">
                  {invitationContent.saveDate.items.map((item, index) => (
                    <article
                      key={item.title + item.copy}
                      className="save-date-item"
                      data-reveal="up"
                      style={revealStyle(180 + index * 80)}
                    >
                      <span className="save-date-item-title">{item.title}</span>
                      <span className="save-date-item-copy">{item.copy}</span>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section
            className="scene scene--program"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.program)}
          >
            <div className="scene-pin">
              <article
                className="section card flowing-card scene-card program-card"
                data-reveal="up"
                style={revealStyle(200)}
              >
                <div className="program-heading">
                  <div className="program-heading-copy">
                    <h2>{invitationContent.program.title}</h2>
                  </div>
                </div>

                <div className="program-stage">
                  <div className="program-stage-flower" aria-hidden="true">
                    <PaperFlower />
                  </div>
                  <div className="program-path" aria-hidden="true">
                    <svg
                      className="program-path-svg"
                      viewBox="0 0 240 780"
                      preserveAspectRatio="none"
                    >
                      <path
                        ref={programPathRef}
                        data-program-path-line
                        className="program-path-line"
                        d="M122 18C154 80 150 156 102 232C58 302 58 366 122 420C185 473 194 552 158 634C133 691 132 736 146 770"
                      />
                    </svg>
                    <div
                      ref={programHeartRef}
                      className="program-heart-track"
                      data-program-heart
                    >
                      <ProgramHeartIcon />
                    </div>
                  </div>

                  <ul className="program-events">
                    {invitationContent.program.items.map((item, index) => (
                      <li
                        key={item.time + item.title}
                        className={`program-event program-event--${item.align}`}
                        data-reveal={index % 2 === 0 ? "left" : "right"}
                        style={programEventStyle(item.top, 60 + index * 120)}
                      >
                        <span className="program-event-time">{item.time}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          </section>

          <section
            className="scene scene--route"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.route)}
          >
            <div className="scene-pin">
              <article
                className="section card venue-shell flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(160)}
              >
                <div className="venue-heading">
                  <p className="eyebrow">{invitationContent.venue.eyebrow}</p>
                  {invitationContent.venue.title ? (
                    <h2>{invitationContent.venue.title}</h2>
                  ) : null}
                  {invitationContent.venue.subtitle ? (
                    <p className="venue-subtitle">
                      {invitationContent.venue.subtitle}
                    </p>
                  ) : null}
                </div>

                <div className="venue-visuals">
                  {invitationContent.venue.photos.map((image, index) => (
                    <figure
                      key={image.src}
                      className="venue-image-card"
                      data-reveal={index % 2 === 0 ? "left" : "right"}
                      style={revealStyle(80 + index * 130)}
                    >
                      <div className="venue-image-frame">
                        <ImageWithSkeleton
                          wrapperClassName="venue-image-media"
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          fetchPriority="low"
                        />
                      </div>
                      <figcaption>
                        <span className="venue-image-title">{image.title}</span>
                        <span className="venue-image-copy">
                          {image.description}
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div
                  className="venue-address-card"
                  data-reveal="up"
                  style={revealStyle(220)}
                >
                  <p className="venue-city">{invitationContent.venue.city}</p>
                  <p className="venue-address">
                    {invitationContent.venue.addressLines[0]}
                    {invitationContent.venue.addressLines[1] ? (
                      <>
                        <br />
                        {invitationContent.venue.addressLines[1]}
                      </>
                    ) : null}
                  </p>
                  <a
                    className="venue-map-link"
                    href={invitationContent.venue.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {invitationContent.venue.mapLabel}
                  </a>
                </div>
              </article>
            </div>
          </section>

          <section
            className="scene scene--dresscode"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.dresscode)}
          >
            <div className="scene-pin">
              <article
                className="section card dresscode-shell flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(180)}
              >
                <h2>{invitationContent.dresscode.title}</h2>
                <p>{invitationContent.dresscode.description}</p>
                <div
                  className="dresscode-visual"
                  data-reveal="zoom"
                  style={revealStyle(130)}
                >
                  {invitationContent.dresscode.looks.length > 0 ? (
                    <div className="dresscode-stage">
                      <div className="dresscode-palette" aria-hidden="true">
                        {dresscodePaletteRows.map((row, rowIndex) => (
                          <div
                            key={rowIndex}
                            className={`dresscode-palette-row dresscode-palette-row--${row.tone}`}
                          >
                            {row.flowers.map((flower, index) => (
                              <span
                                key={`${rowIndex}-${index}`}
                                className="dresscode-palette-item"
                              >
                                <span
                                  className="dresscode-palette-flower"
                                  style={dresscodePaletteFlowerStyle(flower)}
                                >
                                  {Array.from({ length: 6 }).map((_, petal) => (
                                    <span
                                      key={petal}
                                      className="dresscode-palette-petal"
                                      style={
                                        {
                                          "--dresscode-petal-angle": `${petal * 60}deg`,
                                        } as CSSProperties
                                      }
                                    />
                                  ))}
                                  <span className="dresscode-palette-center" />
                                </span>
                                <span className="dresscode-palette-label">
                                  {flower.name}
                                </span>
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div
                        className="dresscode-models"
                        role="list"
                        aria-label="Примеры образов для свадебного дресс-кода"
                      >
                        {invitationContent.dresscode.looks.map(
                          (look, index) => (
                            <figure
                              key={look.id}
                              role="listitem"
                              className={`dresscode-model-card dresscode-model-card--${dresscodeLookSizeClass(index)} dresscode-model-card--${look.variant}`}
                            >
                              <ImageWithSkeleton
                                wrapperClassName="dresscode-model-media"
                                className="dresscode-model-image"
                                src={look.src}
                                alt={look.alt}
                                width={look.width}
                                height={look.height}
                                loading="lazy"
                                fetchPriority="low"
                              />
                            </figure>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            </div>
          </section>

          <section
            className="scene scene--kissme"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.kissMe)}
          >
            <div className="scene-pin">
              <KissMeSection
                titleLineOne={invitationContent.kissMe.titleLineOne}
                titleLineTwo={invitationContent.kissMe.titleLineTwo}
                subtitle={invitationContent.kissMe.subtitle}
                completeMessage={invitationContent.kissMe.completeMessage}
                cat={invitationContent.kissMe.cat}
                items={invitationContent.kissMe.items}
                style={revealStyle(180)}
              />
            </div>
          </section>

          <section
            className="scene scene--details"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.details)}
          >
            <div className="scene-pin">
              <WeddingDetailsSection
                title={invitationContent.details.title}
                items={invitationContent.details.items}
                style={revealStyle(180)}
              />
            </div>
          </section>

          <section
            className="scene scene--rsvp"
            id="rsvp"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.rsvp)}
          >
            <div className="scene-pin">
              <article
                className="section card rsvp-shell flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(220)}
              >
                <h2>{invitationContent.rsvp.title}</h2>
                <p>
                  Пожалуйста, заполните анкету до{" "}
                  <span className="rsvp-date-emphasis">20.05.2026</span>, чтобы
                  мы могли комфортно организовать праздник для всех гостей.
                </p>

                <form className="form" onSubmit={handleSubmit}>
                  <label>
                    {invitationContent.rsvp.fields.fullName.label}
                    <input
                      required
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      onInvalid={handleFieldInvalid}
                      onInput={handleFieldInput}
                      placeholder={
                        invitationContent.rsvp.fields.fullName.placeholder
                      }
                    />
                  </label>

                  <label>
                    {invitationContent.rsvp.fields.phone.label}
                    <input
                      required
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      onInvalid={handleFieldInvalid}
                      onInput={handleFieldInput}
                      placeholder={
                        invitationContent.rsvp.fields.phone.placeholder
                      }
                    />
                  </label>

                  <label>
                    {invitationContent.rsvp.fields.attending.label}
                    <select
                      required
                      name="attending"
                      defaultValue=""
                      onInvalid={handleFieldInvalid}
                      onInput={handleFieldInput}
                      onChange={handleFieldInput}
                    >
                      <option value="" disabled>
                        {invitationContent.rsvp.fields.attending.placeholder}
                      </option>
                      {invitationContent.rsvp.fields.attending.options.map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label>
                    {invitationContent.rsvp.fields.favoriteTrack.label}
                    <input
                      required
                      type="text"
                      name="favoriteTrack"
                      onInvalid={handleFieldInvalid}
                      onInput={handleFieldInput}
                      placeholder={
                        invitationContent.rsvp.fields.favoriteTrack.placeholder
                      }
                    />
                  </label>

                  <fieldset className="rsvp-checkbox-group">
                    <legend>
                      {invitationContent.rsvp.fields.drinkPreferences.label}
                    </legend>
                    <p className="rsvp-checkbox-hint">
                      {invitationContent.rsvp.fields.drinkPreferences.hint}
                    </p>
                    <div className="rsvp-checkbox-options">
                      {invitationContent.rsvp.fields.drinkPreferences.options.map(
                        (option, index) => (
                          <label
                            key={option.value}
                            className="rsvp-checkbox-option"
                          >
                            <input
                              required={index === 0}
                              type="checkbox"
                              name="drinkPreferences"
                              value={option.value}
                              onInvalid={handleFieldInvalid}
                              onInput={handleFieldInput}
                              onChange={handleFieldInput}
                            />
                            <span>{option.label}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </fieldset>

                  <label>
                    {invitationContent.rsvp.fields.message.label}
                    <textarea
                      name="message"
                      rows={4}
                      onInput={handleFieldInput}
                      placeholder={
                        invitationContent.rsvp.fields.message.placeholder
                      }
                    />
                  </label>

                  <button
                    type="submit"
                    className="rsvp-submit-button"
                    disabled={submitState === "submitting"}
                  >
                    {submitState === "submitting"
                      ? invitationContent.rsvp.submittingLabel
                      : invitationContent.rsvp.submitLabel}
                  </button>

                  {submitState === "success" ? (
                    <p className="success" role="status" aria-live="polite">
                      {invitationContent.rsvp.successMessage}
                    </p>
                  ) : null}

                  {submitState === "error" ? (
                    <p className="error" role="alert">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              </article>
            </div>
          </section>

          <section
            className="scene scene--countdown"
            data-scene
            style={sceneDepthStyle(invitationContent.sceneDepths.countdown)}
          >
            <div className="scene-pin">
              <WeddingCountdownSection
                title={invitationContent.countdownSection.title}
                targetDate={invitationContent.weddingDate}
                message={invitationContent.countdownSection.message}
                expiredMessage={
                  invitationContent.countdownSection.expiredMessage
                }
                style={revealStyle(200)}
              />
            </div>
          </section>

          <section
            className="scene scene--support"
            data-scene
            style={sceneDepthStyle(118)}
          >
            <div className="scene-pin">
              <article
                className="section card support-shell flowing-card scene-card"
                data-reveal="up"
                style={revealStyle(220)}
              >
                <p className="support-copy">
                  По всем возникающим вопросам и предложениям в день свадьбы
                  просьба обращаться к нашему
                </p>
                <p className="support-organizer">
                  ОРГАНИЗАТОРУ <span className="support-name">Елена</span>
                </p>
                <a className="support-phone" href="tel:+79065817747">
                  +7 906 581 77 47
                </a>
              </article>
            </div>
          </section>
        </main>

        {isStoryPhotoOpen ? (
          <Lightbox
            activeIndex={0}
            photos={storyIntroLightboxPhotos}
            onClose={() => setIsStoryPhotoOpen(false)}
            onNext={() => {}}
            onPrev={() => {}}
          />
        ) : null}
      </div>
    </>
  );
};
