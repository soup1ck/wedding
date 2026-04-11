import { useState, type CSSProperties } from "react";
import {
  engagementPhotos,
  type EngagementPhoto,
} from "../data/engagementPhotos";
import { ImageWithSkeleton } from "./ImageWithSkeleton";
import { Lightbox } from "./Lightbox";
import "../styles/engagement-gallery.css";

type EngagementGallerySectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  photos?: EngagementPhoto[];
  className?: string;
  style?: CSSProperties;
  reveal?: "up" | "left" | "right" | "zoom";
};

type GallerySlot = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const gallerySlots: GallerySlot[] = [
  { x1: 2, x2: 6, y1: 1, y2: 4 },
  { x1: 6, x2: 8, y1: 2, y2: 4 },
  { x1: 1, x2: 4, y1: 4, y2: 7 },
  { x1: 4, x2: 7, y1: 4, y2: 7 },
  { x1: 7, x2: 9, y1: 4, y2: 6 },
  { x1: 2, x2: 4, y1: 7, y2: 9 },
  { x1: 4, x2: 7, y1: 7, y2: 10 },
  { x1: 7, x2: 10, y1: 6, y2: 9 },
];

const getGallerySlotStyle = (slot: GallerySlot): CSSProperties =>
  ({
    "--x1": slot.x1,
    "--x2": slot.x2,
    "--y1": slot.y1,
    "--y2": slot.y2,
  }) as CSSProperties;

export function EngagementGallerySection({
  id = "engagement-gallery",
  eyebrow = "Моменты",
  title = "",
  subtitle,
  photos = engagementPhotos,
  className = "",
  style,
  reveal = "up",
}: EngagementGallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!photos.length) {
    return null;
  }

  const openAtIndex = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return 0;
      }

      return (currentIndex + 1) % photos.length;
    });
  };

  const showPrev = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return photos.length - 1;
      }

      return (currentIndex - 1 + photos.length) % photos.length;
    });
  };

  return (
    <>
      <section
        id={id}
        className={`engagement-gallery-section ${className}`.trim()}
        data-reveal={reveal}
        style={style}
      >
        <header className="engagement-gallery-header">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h2 className="engagement-gallery-title">{title}</h2> : null}
          {subtitle ? (
            <p className="engagement-gallery-subtitle">{subtitle}</p>
          ) : null}
        </header>

        <ul className="engagement-gallery-mosaic" aria-label="Галерея фото">
          {gallerySlots.map((slot, slotIndex) => {
            const photoIndex = slotIndex % photos.length;
            const photo = photos[photoIndex];

            return (
              <li
                key={`${photo.id}-${slotIndex}`}
                className="engagement-gallery-mosaic-item"
                style={getGallerySlotStyle(slot)}
              >
                <button
                  type="button"
                  className="engagement-gallery-card"
                  onClick={() => openAtIndex(photoIndex)}
                  aria-label={`Открыть фото ${photoIndex + 1} из ${
                    photos.length
                  }`}
                >
                  <ImageWithSkeleton
                    wrapperClassName="engagement-gallery-card-media"
                    src={photo.thumbSrc}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                    className="engagement-gallery-card-image"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {activeIndex !== null ? (
        <Lightbox
          activeIndex={activeIndex}
          photos={photos}
          onClose={closeLightbox}
          onNext={showNext}
          onPrev={showPrev}
        />
      ) : null}
    </>
  );
}
