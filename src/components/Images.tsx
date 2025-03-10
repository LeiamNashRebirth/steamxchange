import { useState, useEffect } from "react";

const Images = ({ src }: { src?: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [zoomedImage]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (imageLoaded) {
        setShowSkeleton(false);
      }
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, [imageLoaded]);

  return (
    <div>
      {showSkeleton && (
        <div className="w-full h-[500px] bg-gray-700 animate-pulse rounded-lg mb-4"></div>
      )}

      {src && (
        <img
          src={src}
          alt="LeiamNash"
          className={`w-full rounded-xl hover:scale-105 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            setImageLoaded(true);
            setShowSkeleton(false);
          }}
          onClick={() => setZoomedImage(src)}
        />
      )}

      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="LeiamNash" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};

export default Images;