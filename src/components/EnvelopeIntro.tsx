type EnvelopeIntroProps = {
  isOpening: boolean;
  onOpen: () => void;
};

const RingsIcon = () => (
  <svg
    className="intro-rings"
    viewBox="0 0 120 120"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="46" cy="67" r="22" className="ring-shape" />
    <circle cx="74" cy="67" r="22" className="ring-shape" />
    <path d="M74 24 l8 9 -8 9 -8 -9 z" className="ring-diamond-main" />
    <path d="M74 18 l4 5 h-8 z" className="ring-diamond-facet" />
    <path d="M69 33 h10" className="ring-diamond-cut" />
  </svg>
);

export const EnvelopeIntro = ({ isOpening, onOpen }: EnvelopeIntroProps) => {
  return (
    <div className={`intro-overlay${isOpening ? " opening" : ""}`}>
      <div className="intro-stage">
        <div className="intro-wing intro-wing-right" />
        <div className="intro-wing intro-wing-left" />

        <button
          type="button"
          className="intro-seal"
          aria-label="Открыть конверт"
          onClick={onOpen}
          disabled={isOpening}
        >
          <RingsIcon />
        </button>
        <p className="intro-tap-hint">Тап по кольцам</p>

        <div className="intro-envelope" aria-hidden="true">
          <div className="intro-envelope-top" />
          <div className="intro-envelope-sides" />
        </div>
      </div>
    </div>
  );
};
