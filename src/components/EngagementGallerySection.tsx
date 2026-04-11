import { useId, useState, type CSSProperties } from "react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const galleryId = useId();

  if (!photos.length) {
    return null;
  }

  const normalizedSelectedIndex = selectedIndex % photos.length;
  const selectedPhoto = photos[normalizedSelectedIndex];
  const selectedPhotoCaption = (selectedPhoto.caption ?? selectedPhoto.alt)
    .replace(/\s*год\s*$/i, "")
    .trim();

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

        <ul
          className="engagement-gallery-orbit"
          aria-label="Галерея фото"
          style={
            {
              "--items": photos.length,
              "--index": normalizedSelectedIndex,
            } as CSSProperties
          }
        >
          {photos.map((photo, photoIndex) => {
            const inputId = `${galleryId}-photo-${photoIndex}`;

            return (
              <li
                key={photo.id}
                className="engagement-gallery-orbit-item"
                style={{ "--i": photoIndex } as CSSProperties}
              >
                <input
                  className="engagement-gallery-orbit-input"
                  type="radio"
                  id={inputId}
                  name={`${galleryId}-gallery-item`}
                  checked={normalizedSelectedIndex === photoIndex}
                  onChange={() => setSelectedIndex(photoIndex)}
                />
                <label
                  className="engagement-gallery-orbit-label"
                  htmlFor={inputId}
                  aria-label={`Показать фото ${photoIndex + 1} из ${
                    photos.length
                  }`}
                >
                  <img
                    src={photo.thumbSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </label>
                <button
                  type="button"
                  className="engagement-gallery-orbit-photo"
                  onClick={() => openAtIndex(photoIndex)}
                  aria-label={`Открыть фото ${photoIndex + 1} из ${
                    photos.length
                  }`}
                  tabIndex={
                    normalizedSelectedIndex === photoIndex ? undefined : -1
                  }
                >
                  <ImageWithSkeleton
                    wrapperClassName="engagement-gallery-orbit-media"
                    src={photo.thumbSrc}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading={photoIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="engagement-gallery-orbit-image"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {selectedPhotoCaption ? (
          <p className="engagement-gallery-orbit-caption">
            {selectedPhotoCaption} &#10084;
          </p>
        ) : null}
      </section>

      {activeIndex !== null ? (
        <Lightbox
          activeIndex={activeIndex}
          photos={photos}
          onClose={closeLightbox}
          onNext={showNext}
          onPrev={showPrev}
          allowNavigation={false}
          showCaption={false}
        />
      ) : null}
    </>
  );
}
