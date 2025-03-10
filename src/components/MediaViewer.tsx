"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";

const MediaViewer = ({ src, type, onClose }) => {
  const [scale, setScale] = useState(1);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prev) => Math.min(Math.max(prev + e.deltaY * -0.001, 1), 3));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        <X size={30} />
      </button>
      <div className="max-w-4xl w-full h-full flex items-center justify-center p-4">
        {type === "video" ? (
          <VideoPlayer src={src} />
        ) : (
          <div
            className="overflow-hidden"
            style={{ transform: `scale(${scale})` }}
            onWheel={handleWheel}
          >
            <img
              src={src}
              alt="Media Preview"
              width={800}
              height={600}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewer;