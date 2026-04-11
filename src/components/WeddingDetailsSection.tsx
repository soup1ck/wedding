import type { CSSProperties } from "react";
import type { DetailItem } from "../config/invitationContent";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

type WeddingDetailsSectionProps = {
  title: string;
  items: DetailItem[];
  image?: {
    src: string;
    alt: string;
  };
  style?: CSSProperties;
};

export const WeddingDetailsSection = ({
  title,
  items,
  image,
  style,
}: WeddingDetailsSectionProps) => (
  <article
    className="section card details-shell flowing-card scene-card"
    data-reveal="up"
    style={style}
  >
    <h2 className="details-title">{title}</h2>

    <ol className="details-list">
      {items.map((item, index) => (
        <li
          key={item.number}
          className={`details-item details-item--${item.align}`}
          data-reveal={item.align === "right" ? "right" : "left"}
          style={
            { "--reveal-delay": `${120 + index * 120}ms` } as CSSProperties
          }
        >
          <div className="details-number-wrap" aria-hidden="true">
            <span className="details-brush details-brush--primary" />
            <span className="details-brush details-brush--secondary" />
            <span className="details-number">{item.number}</span>
          </div>
          <p className="details-text">{item.text}</p>
        </li>
      ))}
    </ol>

    {image ? (
      <figure
        className="details-photo-card"
        data-reveal="zoom"
        style={{ "--reveal-delay": "420ms" } as CSSProperties}
      >
        <ImageWithSkeleton
          wrapperClassName="details-photo-media"
          className="details-photo"
          src={image.src}
          alt={image.alt}
          loading="lazy"
          fetchPriority="low"
        />
      </figure>
    ) : null}
  </article>
);
