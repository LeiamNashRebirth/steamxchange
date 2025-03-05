"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/loading/Skeleton";
import { motion } from "framer-motion";
import { getContent } from "@/utils/leiam";

const categories = ["physics", "chemistry", "biology", "research", "capstone"];

export default function VideoPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedThumbnails, setLoadedThumbnails] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState("physics");
  const router = useRouter();
  
useEffect(() => {
  const fetchVideos = async () => {
      setLoading(true);
      const data = await getContent(selectedCategory);
      setVideos(data);
      setLoading(false);
  };
    fetchVideos();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="text-white p-4 text-lg font-bold">
        Video
      </div>
      <div className="flex gap-3 px-4 py-2 overflow-x-auto border-b border-gray-700 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === category ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg bg-gray-800" />
            ))
          : videos.map((video) => (
              <motion.div
                key={video.id}
                className="cursor-pointer rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/watch/${video.id}`)}
              >
                <div className="relative">
                  {!loadedThumbnails[video.id] && (
                    <Skeleton className="h-[20vh] lg:h-[20vh] w-full rounded-t-lg bg-gray-800" />
                  )}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={`w-full rounded-t-lg transition-opacity duration-300 ${
                      loadedThumbnails[video.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setLoadedThumbnails((prev) => ({ ...prev, [video.id]: true }))}
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3">
                  <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
                  <p className="text-sm text-gray-400">{video.views} views • {video.uploaded}</p>
                  <p className="text-sm text-gray-300">{video.name}</p>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
