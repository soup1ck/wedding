import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from "react";

type ImageWithSkeletonProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "style"> & {
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  imgStyle?: CSSProperties;
};

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

export function ImageWithSkeleton({
  wrapperClassName,
  wrapperStyle,
  imgStyle,
  className,
  src,
  alt,
  onLoad,
  onError,
  ...imgProps
}: ImageWithSkeletonProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) {
      return;
    }

    if (image.complete && image.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
  }, [src]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onError?.(event);
  };

  return (
    <span
      className={joinClassNames(
        "image-with-skeleton",
        isLoaded ? "is-loaded" : undefined,
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      <span className="image-with-skeleton__placeholder" aria-hidden="true" />
      <img
        {...imgProps}
        ref={imageRef}
        className={className}
        style={imgStyle}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
      />
    </span>
  );
}
