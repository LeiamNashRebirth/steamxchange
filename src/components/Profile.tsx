import { useState } from 'react';

const Profile = ({ src, alt }: { src?: string; alt: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-12 h-12">
      {!imageLoaded && <div className="w-12 h-12 bg-gray-700 animate-pulse rounded-full shadow-md"></div>}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-12 h-12 rounded-full shadow-md transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
};

export default Profile;
