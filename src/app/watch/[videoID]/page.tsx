"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/loading/Skeleton";
import { motion } from "framer-motion";
import Player from "@/components/Player";
import { getInfo, getSearch } from "@/utils/leiam";
import { Leiam } from "@/env/secrets";
import { Share2, MessageCircle, X } from "lucide-react";
import CommentSection from "@/components/CommentSectionVideo";

export default function WatchPage() {
  const { videoID } = useParams<{ videoID: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!videoID) return;
    const fetchVideoInfo = async () => {
      setLoading(true);
      setLoadingRelated(true);
      const data = await getInfo(videoID);
      const related = await getSearch(data.keywords);
      setLoading(false);
      setLoadingRelated(false);
      setRelatedVideos(related);
      setVideo(data);
    };
    fetchVideoInfo();
  }, [videoID]);

  const handleShare = async () => {
    const link = `${window.location.origin}/watch/${videoID}`;
    await navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const toggleComments = (postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="text-white pt-6 text-lg font-bold px-4 mb-3">Watch</div>

      <div className="w-full lg:w-3/4">
        {loading ? (
          <Skeleton className="w-full h-[25vh] lg:h-[45vh] rounded-lg bg-[#131313]" />
        ) : (
          <Player
            className="w-full h-[25vh] lg:h-[45vh]"
            poster={video?.thumbnail}
            url={`${Leiam}/video/watch/${videoID}`}
            getInstance="function"
          />
        )}

        <div className="mt-4 flex justify-between items-center">
          {loading ? (
            <Skeleton className="h-6 w-3/4 bg-[#131313]" />
          ) : (
            <h1 className="text-xl font-semibold">{video?.title}</h1>
          )}

          <div className="flex gap-4">
            <button onClick={() => toggleComments(videoID)} className="p-2 rounded-full hover:bg-[#1a1a1a] transition" >
              <MessageCircle />
                    </button>
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-[#1a1a1a] transition">
              <Share2 size={22} />
            </button>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-4 w-1/2 bg-[#131313] mt-2" />
        ) : (
          <p className="text-gray-400 mt-1">{video?.views} views • {video?.uploaded}</p>
        )}

        <div className="flex items-center mt-4">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full bg-[#131313]" />
          ) : (
            <img src={video?.channel} alt={video?.name} className="h-12 w-12 rounded-full" />
          )}

          <div className="ml-3">
            {loading ? (
              <Skeleton className="h-5 w-24 bg-[#131313]" />
            ) : (
              <p className="text-lg font-medium">{video?.name}</p>
            )}

            {loading ? (
              <Skeleton className="h-4 w-16 bg-[#131313] mt-1" />
            ) : (
              <p className="text-sm text-gray-400">{video?.subscriber} subscribers</p>
            )}
          </div>
        </div>

        <div className="mt-4 mb-4 p-4 bg-[#131313] rounded-lg">
          {loading ? (
            <Skeleton className="h-32 w-full bg-[#131313]" />
          ) : (
            <p className="text-gray-300 text-sm">{video?.description}</p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/4">
        {loadingRelated ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full mb-4 bg-[#131313] rounded-lg" />
          ))
        ) : (
          relatedVideos.map((related) => (
            <motion.div
              key={related.id}
              className="flex items-start gap-3 p-2 mb-3 rounded-lg bg-[#131313] hover:bg-[#1a1a1a] cursor-pointer transition-all"
              whileHover={{ scale: 1.03 }}
              onClick={() => router.push(`/watch/${related.id}`)}
            >
              <img src={related.thumbnail} alt={related.title} className="w-32 h-20 rounded-md" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold line-clamp-2">{related.title}</h2>
                <p className="text-xs text-gray-400">{related.views} views • {related.uploaded}</p>
                <p className="text-xs text-gray-300">{related.name}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
    <div className="p-4 overflow-y-auto h-full">
            {visibleComments[videoID] && <CommentSection postId={videoID} onClose={() => toggleComments(videoID)} />}
        </div>
    </div>
  );
}