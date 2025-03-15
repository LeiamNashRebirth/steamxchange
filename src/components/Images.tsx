"use client";

import { useState, useEffect, useRef } from "react";

const Images = ({ src }: { src?: string | string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const images = Array.isArray(src) ? src.filter(Boolean) : src ? [src] : [];

  useEffect(() => {
    document.body.style.overflow = zoomedImage ? "hidden" : "";
  }, [zoomedImage]);

  useEffect(() => {
    if (imageLoaded) {
      setTimeout(() => setShowSkeleton(false), 500);
    }
  }, [imageLoaded]);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX;

    if (swipeDistance > 50) handleNext();
    else if (swipeDistance < -50) handlePrev();

    setTimeout(() => setIsSwiping(false), 300);
    touchStartX.current = null;
  };

  const handlePrev = () => {
    setShowSkeleton(true);
    setImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setShowSkeleton(true);
    setImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    setShowSkeleton(false);
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setImageSize({ width: naturalWidth, height: naturalHeight });
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`relative flex transition-transform duration-300 ease-in-out ${isSwiping ? "animate-swipe" : ""}`}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        {showSkeleton && (
          <div
            className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg"
            style={{
              width: imageSize ? `${imageSize.width}px` : "100%",
              height: imageSize ? `${imageSize.height}px` : "500px",
            }}
          ></div>
        )}

        <img
          ref={imgRef}
          src={images[currentIndex]}
          alt="Preview"
          className={`w-full rounded-xl object-cover transition-opacity duration-500 transform ${isSwiping ? "scale-95" : "scale-100"} ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleImageLoad}
          onClick={() => setZoomedImage(images[currentIndex])}
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full bg-white transition ${index === currentIndex ? "bg-opacity-100 scale-110" : "bg-opacity-50"}`}
            ></span>
          ))}
        </div>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full transition-transform duration-300 ease-in-out" />
        </div>
      )}
    </div>
  );
};

export default Images;