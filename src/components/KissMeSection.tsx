import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { KissMeItem } from "../config/invitationContent";

type KissMeSectionProps = {
  titleLineOne: string;
  titleLineTwo: string;
  subtitle: string;
  completeMessage: string;
  cat: {
    src: string;
    alt: string;
  };
  items: KissMeItem[];
  style?: CSSProperties;
};

type DragState = {
  id: string;
  startClientX: number;
  startClientY: number;
  originX: number;
  originY: number;
};

type Position = {
  x: number;
  y: number;
};

const toPixels = (
  position: { x: number; y: number },
  rect: DOMRect,
): Position => ({
  x: (position.x / 100) * rect.width,
  y: (position.y / 100) * rect.height,
});

const toBoardPixelsFromRect = (
  position: { x: number; y: number },
  boardRect: DOMRect,
  sourceRect: DOMRect,
): Position => ({
  x: sourceRect.left - boardRect.left + (position.x / 100) * sourceRect.width,
  y: sourceRect.top - boardRect.top + (position.y / 100) * sourceRect.height,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const KissMeSection = ({
  titleLineOne,
  titleLineTwo,
  subtitle,
  completeMessage,
  cat,
  items,
  style,
}: KissMeSectionProps) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const catWrapRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const positionsRef = useRef<Record<string, Position>>({});
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [placedItems, setPlacedItems] = useState<Record<string, boolean>>({});
  const [activeDrag, setActiveDrag] = useState<DragState | null>(null);
  const [successPulseId, setSuccessPulseId] = useState<string | null>(null);

  const requiredItemIds = useMemo(
    () => items.filter((item) => item.required).map((item) => item.id),
    [items],
  );

  const isComplete = requiredItemIds.every((id) => placedItems[id]);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    const syncPositions = () => {
      const board = boardRef.current;
      const catWrap = catWrapRef.current;
      if (!board || !catWrap) {
        return;
      }

      const rect = board.getBoundingClientRect();
      const catRect = catWrap.getBoundingClientRect();
      const nextPositions = Object.fromEntries(
        items.map((item) => {
          if (placedItems[item.id]) {
            return [
              item.id,
              toBoardPixelsFromRect(item.snapPosition, rect, catRect),
            ];
          }

          return [item.id, toPixels(item.startPosition, rect)];
        }),
      );

      setPositions(nextPositions);
    };

    syncPositions();
    window.addEventListener("resize", syncPositions, { passive: true });

    return () => {
      window.removeEventListener("resize", syncPositions);
    };
  }, [items, placedItems]);

  useEffect(() => {
    if (!successPulseId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessPulseId(null);
    }, 520);

    return () => window.clearTimeout(timeoutId);
  }, [successPulseId]);

  useEffect(() => {
    if (!activeDrag) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const board = boardRef.current;
      const draggedItem = items.find((item) => item.id === activeDrag.id);
      const button = itemRefs.current[activeDrag.id];
      if (!board || !draggedItem || !button || placedItems[draggedItem.id]) {
        return;
      }

      const rect = board.getBoundingClientRect();
      const itemRect = button.getBoundingClientRect();
      const itemWidth = itemRect.width;
      const itemHeight = itemRect.height;
      const nextX = clamp(
        activeDrag.originX + (event.clientX - activeDrag.startClientX),
        itemWidth * 0.5,
        rect.width - itemWidth * 0.5,
      );
      const nextY = clamp(
        activeDrag.originY + (event.clientY - activeDrag.startClientY),
        itemHeight * 0.5,
        rect.height - itemHeight * 0.5,
      );

      setPositions((current) => ({
        ...current,
        [draggedItem.id]: { x: nextX, y: nextY },
      }));
    };

    const handlePointerUp = () => {
      const board = boardRef.current;
      const catWrap = catWrapRef.current;
      const draggedItem = items.find((item) => item.id === activeDrag.id);
      if (!board || !catWrap || !draggedItem) {
        setActiveDrag(null);
        return;
      }

      const rect = board.getBoundingClientRect();
      const catRect = catWrap.getBoundingClientRect();
      const currentPosition =
        positionsRef.current[draggedItem.id] ??
        toPixels(draggedItem.startPosition, rect);
      const target = toBoardPixelsFromRect(
        draggedItem.targetZone,
        rect,
        catRect,
      );
      const snap = toBoardPixelsFromRect(
        draggedItem.snapPosition,
        rect,
        catRect,
      );
      const radius =
        (draggedItem.targetZone.radius / 100) *
        Math.min(catRect.width, catRect.height);
      const distance = Math.hypot(
        currentPosition.x - target.x,
        currentPosition.y - target.y,
      );
      const matched = distance <= radius;

      setPositions((current) => ({
        ...current,
        [draggedItem.id]: matched
          ? snap
          : toPixels(draggedItem.startPosition, rect),
      }));
      setPlacedItems((current) => ({
        ...current,
        [draggedItem.id]: matched,
      }));

      if (matched) {
        setSuccessPulseId(draggedItem.id);
      }

      setActiveDrag(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [activeDrag, items, placedItems]);

  const handlePointerDown =
    (item: KissMeItem) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (placedItems[item.id]) {
        return;
      }

      const board = boardRef.current;
      if (!board) {
        return;
      }

      const rect = board.getBoundingClientRect();
      const currentPosition =
        positions[item.id] ?? toPixels(item.startPosition, rect);

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setActiveDrag({
        id: item.id,
        startClientX: event.clientX,
        startClientY: event.clientY,
        originX: currentPosition.x,
        originY: currentPosition.y,
      });
    };

  return (
    <article
      className="section card kissme-shell flowing-card scene-card"
      data-reveal="up"
      style={style}
    >
      <header className="kissme-header">
        <h2 className="kissme-title">
          <span>{titleLineOne}</span>
          <span>{titleLineTwo}</span>
        </h2>
        <p className="kissme-subtitle">{subtitle}</p>
      </header>

      <div className="kissme-board" ref={boardRef}>
        <div className="kissme-board-glow" aria-hidden="true" />
        <div className="kissme-cat-wrap" ref={catWrapRef}>
          <img
            className="kissme-cat"
            src={cat.src}
            alt={cat.alt}
            loading="lazy"
            decoding="async"
          />
        </div>

        {items.map((item) => {
          const position = positions[item.id];
          const isPlaced = Boolean(placedItems[item.id]);
          const isActive = activeDrag?.id === item.id;
          const isPulsing = successPulseId === item.id;

          return (
            <button
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              type="button"
              className={`kissme-draggable kissme-draggable--${item.id}${isPlaced ? " is-placed" : ""}${isActive ? " is-active" : ""}${isPulsing ? " is-pulsing" : ""}`}
              style={
                {
                  "--kissme-item-width": `${item.width}%`,
                  "--kissme-item-x": `${position?.x ?? 0}px`,
                  "--kissme-item-y": `${position?.y ?? 0}px`,
                } as CSSProperties
              }
              aria-label={item.label}
              onPointerDown={handlePointerDown(item)}
            >
              <img
                src={item.assetSrc}
                alt=""
                aria-hidden="true"
                className="kissme-item-image"
                loading="lazy"
                decoding="async"
              />
            </button>
          );
        })}
      </div>

      <p
        className={`kissme-complete${isComplete ? " is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {completeMessage}
      </p>
    </article>
  );
};
