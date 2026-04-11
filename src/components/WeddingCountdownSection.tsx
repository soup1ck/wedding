import { useEffect, useState, type CSSProperties } from "react";
import flowersDecoration from "../assets/assetsflowers.png";
import countdownIllustration from "../assets/risunokvovanastya.png";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

type WeddingCountdownSectionProps = {
  className?: string;
  targetDate: Date;
  title: string;
  message: readonly string[];
  expiredMessage: string;
  style?: CSSProperties;
};

type CountdownPart = {
  value: number;
  label: string;
};

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

const getCountdownState = (
  targetDate: Date,
  currentTime: number,
): CountdownState => {
  const distance = targetDate.getTime() - currentTime;

  if (distance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(distance / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  };
};

const formatCounterValue = (value: number, label: string) =>
  label === "ДНЕЙ" ? String(value) : String(value).padStart(2, "0");

export const WeddingCountdownSection = ({
  className,
  targetDate,
  title,
  message,
  expiredMessage,
  style,
}: WeddingCountdownSectionProps) => {
  const [countdown, setCountdown] = useState(() =>
    getCountdownState(targetDate, Date.now()),
  );

  useEffect(() => {
    setCountdown(getCountdownState(targetDate, Date.now()));

    const interval = window.setInterval(() => {
      setCountdown(getCountdownState(targetDate, Date.now()));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const parts: CountdownPart[] = [
    { value: countdown.days, label: "ДНЕЙ" },
    { value: countdown.hours, label: "ЧАСОВ" },
    { value: countdown.minutes, label: "МИНУТ" },
    { value: countdown.seconds, label: "СЕКУНД" },
  ];

  return (
    <article
      className={[
        "section card wedding-countdown-shell flowing-card scene-card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-reveal="up"
      style={style}
    >
      <div className="wedding-countdown-frame">
        <div className="wedding-countdown-floral" aria-hidden="true">
          <div className="wedding-countdown-garland">
            <img
              className="wedding-countdown-flowers wedding-countdown-flowers--main"
              src={flowersDecoration}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="wedding-countdown-fringe">
            <img
              className="wedding-countdown-flowers wedding-countdown-flowers--fringe"
              src={flowersDecoration}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="wedding-countdown-content">
          <h2 className="wedding-countdown-title">{title}</h2>

          <div
            className="wedding-countdown-timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {countdown.isExpired ? (
              <p className="wedding-countdown-expired">{expiredMessage}</p>
            ) : (
              <>
                <div className="wedding-countdown-values" role="timer">
                  {parts.map((part, index) => (
                    <div key={part.label} className="wedding-countdown-unit">
                      <div className="wedding-countdown-unit-value">
                        <span className="wedding-countdown-number">
                          {formatCounterValue(part.value, part.label)}
                        </span>
                        <span className="wedding-countdown-label">
                          {part.label}
                        </span>
                      </div>
                      {index < parts.length - 1 ? (
                        <span
                          className="wedding-countdown-separator"
                          aria-hidden="true"
                        >
                          :
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="wedding-countdown-message">
            {message.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="wedding-countdown-figure">
            <ImageWithSkeleton
              wrapperClassName="wedding-countdown-illustration-media"
              className="wedding-countdown-illustration"
              src={countdownIllustration}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
