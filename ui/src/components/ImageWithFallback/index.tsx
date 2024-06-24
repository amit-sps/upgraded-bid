interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
}) => {
  const handleError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackSrc;
  };
  return (
    <img src={src} alt={alt} className={className} onError={handleError} />
  );
};

export default ImageWithFallback;
