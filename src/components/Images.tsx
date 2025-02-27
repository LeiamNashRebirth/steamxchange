import { useState, useEffect } from 'react';

const Images = ({ src, alt }: { src?: string; alt: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [initialDelay, setInitialDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialDelay(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full" style={{ maxHeight: '400px' }}>
      {(!imageLoaded || initialDelay) && (
        <div className="w-full h-[900px] bg-gray-700 animate-pulse rounded-lg mb-4"></div>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-full max-h-[400px] object-contain rounded-lg transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ maxHeight: '400px' }}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
};

export default Images;
