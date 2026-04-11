import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import type { EngagementPhoto } from "../data/engagementPhotos";
import { ImageWithSkeleton } from "./ImageWithSkeleton";

type LightboxProps = {
  activeIndex: number;
  photos: EngagementPhoto[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  allowNavigation?: boolean;
  showCaption?: boolean;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function Lightbox({
  activeIndex,
  photos,
  onClose,
  onNext,
  onPrev,
  allowNavigation = true,
  showCaption = true,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const currentPhoto = photos[activeIndex];
  const hasMultiplePhotos = photos.length > 1;
  const canNavigate = allowNavigation && hasMultiplePhotos;
  const photoCaption = currentPhoto.caption ?? currentPhoto.alt;

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight" && canNavigate) {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key === "ArrowLeft" && canNavigate) {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canNavigate, onClose, onNext, onPrev]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (!canNavigate || Math.abs(deltaX) < 48) {
      return;
    }

    if (deltaX < 0) {
      onNext();
      return;
    }

    onPrev();
  };

  if (!currentPhoto) {
    return null;
  }

  return createPortal(
    <div
      className="engagement-lightbox-backdrop"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        className="engagement-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр фотографий"
      >
        <button
          ref={closeButtonRef}
          className="engagement-lightbox-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть галерею"
        >
          <span aria-hidden="true">×</span>
        </button>

        {canNavigate ? (
          <button
            className="engagement-lightbox-nav engagement-lightbox-nav--prev"
            type="button"
            onClick={onPrev}
            aria-label="Предыдущая фотография"
          >
            <span aria-hidden="true">‹</span>
          </button>
        ) : null}

        <div
          className="engagement-lightbox-stage"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithSkeleton
            wrapperClassName="engagement-lightbox-media"
            src={currentPhoto.fullSrc}
            alt={currentPhoto.alt}
            width={currentPhoto.width}
            height={currentPhoto.height}
            className="engagement-lightbox-image"
          />
        </div>

        {canNavigate ? (
          <button
            className="engagement-lightbox-nav engagement-lightbox-nav--next"
            type="button"
            onClick={onNext}
            aria-label="Следующая фотография"
          >
            <span aria-hidden="true">›</span>
          </button>
        ) : null}

        <div className="engagement-lightbox-meta" aria-live="polite">
          {hasMultiplePhotos ? (
            <span className="engagement-lightbox-counter">
              {activeIndex + 1} / {photos.length}
            </span>
          ) : null}
          {showCaption && photoCaption ? (
            <p className="engagement-lightbox-caption">{photoCaption}</p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
