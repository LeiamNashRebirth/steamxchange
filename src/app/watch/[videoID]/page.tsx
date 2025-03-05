"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/loading/Skeleton";
import { motion } from "framer-motion";
import Player from "@/components/Player";
import { getInfo, getSearch } from "@/utils/leiam";
import { Leiam } from "@/env/secrets";

export default function WatchPage() {
  const { videoID } = useParams<{ videoID: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row p-4 gap-6">
      <div className="w-full lg:w-3/4">
        {loading ? (
          <Skeleton className="w-full h-[25vh] lg:h-[45vh] rounded-lg bg-gray-800" />
        ) : (
          <Player
            className="w-full h-[25vh] lg:h-[45vh]"
            poster={video?.thumbnail}
            url={`${Leiam}/video/watch/${videoID}`}
            getInstance="function"
          />
        )}
        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-6 w-3/4 bg-gray-800" />
          ) : (
            <h1 className="text-xl font-semibold">{video?.title}</h1>
          )}

          {loading ? (
            <Skeleton className="h-4 w-1/2 bg-gray-700 mt-2" />
          ) : (
            <p className="text-gray-400 mt-1">
              {video?.views} views • {video?.uploaded}
            </p>
          )}
        </div>
        <div className="flex items-center mt-4">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
          ) : (
            <img src={video?.channel} alt={video?.name} className="h-12 w-12 rounded-full" />
          )}

          <div className="ml-3">
            {loading ? (
              <Skeleton className="h-5 w-24 bg-gray-700" />
            ) : (
              <p className="text-lg font-medium">{video?.name}</p>
            )}

            {loading ? (
              <Skeleton className="h-4 w-16 bg-gray-600 mt-1" />
            ) : (
              <p className="text-sm text-gray-400">{video?.subscriber} subscribers</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          {loading ? (
            <Skeleton className="h-32 w-full bg-gray-700" />
          ) : (
            <p className="text-gray-300 text-sm">{video?.description}</p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/4">
        {loadingRelated ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full mb-4 bg-gray-800 rounded-lg" />
          ))
        ) : (
          relatedVideos.map((related) => (
            <motion.div
              key={related.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all"
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
    </div>
  );
}
