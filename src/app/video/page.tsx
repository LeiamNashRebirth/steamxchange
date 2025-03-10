"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/loading/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, getSearch } from "@/utils/leiam";
import { Search, X } from "lucide-react";

const categories = ["physics", "chemistry", "biology", "research", "capstone"];

export default function VideoPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("physics");
  const [loadedThumbnails, setLoadedThumbnails] = useState<{ [key: string]: boolean }>({});
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

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSearchOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    const results = await getSearch(searchQuery);
    setSearchResults(results);
    setSearchLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="text-white pt-6 text-lg font-bold px-4 mb-3 flex justify-between items-center">
        <span>Video</span>
        <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white transition">
          <Search size={24} />
        </button>
      </div>

      <div className="flex gap-3 px-4 py-2 overflow-x-auto border-b border-[#0f0f0f] scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === category
                ? "bg-[#1e1e1e] text-white"
                : "bg-[#0f0f0f] text-gray-400 hover:bg-[#1a1a1a]"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-lg bg-[#0f0f0f]" />
            ))
          : videos.map((video) => (
              <motion.div
                key={video.id}
                className="cursor-pointer bg-[#131313] rounded-2xl p-4 shadow-lg hover:bg-[#1a1a1a] transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/watch/${video.id}`)}
              >
                <div className="relative">
                  {!loadedThumbnails[video.id] && (
                    <Skeleton className="h-40 w-full rounded-lg bg-gray-800" />
                  )}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className={`w-full rounded-lg transition-opacity duration-300 ${
                      loadedThumbnails[video.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() =>
                      setLoadedThumbnails((prev) => ({ ...prev, [video.id]: true }))
                    }
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
                <p className="text-sm text-gray-400">{video.views} views • {video.uploaded}</p>
              </motion.div>
            ))}
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center px-4 pt-20 overflow-hidden"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
            >
              <X size={28} />
            </button>

            <div className="w-full max-w-lg bg-[#1e1e1e] flex items-center px-4 py-2 rounded-full">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent text-white outline-none px-3"
                placeholder="Search videos..."
              />
            </div>

            <div className="mt-6 w-full max-w-4xl flex-1 overflow-y-auto px-4">
              {searchLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-40 w-full rounded-lg bg-[#1e1e1e]" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((video) => (
                    <motion.div
                      key={video.id}
                      className="cursor-pointer bg-[#131313] rounded-2xl p-4 shadow-lg hover:bg-[#1a1a1a] transition-all"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        router.push(`/watch/${video.id}`);
                        setIsSearchOpen(false);
                      }}
                    >
                      <div className="relative">
                        {!loadedThumbnails[video.id] && (
                          <Skeleton className="h-40 w-full rounded-lg bg-gray-800" />
                        )}
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className={`w-full rounded-lg transition-opacity duration-300 ${
                            loadedThumbnails[video.id] ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() =>
                            setLoadedThumbnails((prev) => ({ ...prev, [video.id]: true }))
                          }
                        />
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold mt-2">{video.title}</h2>
                      <p className="text-sm text-gray-400">{video.views} views • {video.uploaded}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-6">No results found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}