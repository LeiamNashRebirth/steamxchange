"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "@/utils/database";
import { Heart, MessageCircle, Pin } from "lucide-react";
import PostForm from "@/components/PostForm";
import CommentSection from "@/components/CommentSection";
import Images from "@/components/Images";
import VideoPlayer from "@/components/VideoPlayer";
import UserAvatar from "@/components/UserAvatar";

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) return;

      const allPosts = await database.getFeedData();
      setPosts(
        allPosts.map((post: any) => ({
          ...post,
          likedByClient: post.liked.includes(clientUID),
          pinnedByClient: post.pinned.includes(clientUID) || false,
        }))
      );
      setLoading(false);
    };

    fetchUserDataAndPosts();
  }, [router]);

  const handleLike = async (postId: string) => {
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    try {
      const updatedPost = await database.likeFeed(postId, clientUID);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: updatedPost.likes, likedByClient: true }
            : post
        )
      );
    } catch (error) {}
  };

  const handlePin = async (postId: string) => {
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    try {
      const updatedPost = await database.addPin(clientUID, postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, pins: updatedPost.pins, pinnedByClient: true }
            : post
        )
      );
    } catch (error) {}
  };

  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const toggleComments = (postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-6 pt-6">
        <PostForm setPosts={setPosts} />
        {loading ? (
          <div className="flex justify-center py-10 text-lg">Loading...</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-[#0f0f0f] rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <UserAvatar userId={post.uid} onClick={() => navigateToProfile(post.uid)} />
                  <div>
                    <p className="text-white font-semibold" onClick={() => navigateToProfile(post.uid)}>
                      {post.username}
                    </p>
                    <p className="text-gray-400 text-sm" onClick={() => navigateToProfile(post.uid)}>
                      {post.section} {post.grade}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm" onClick={() => navigateToProfile(post.uid)}>
                  {formatDateTime(post.date)}
                </p>
              </div>

              <p className="text-white mt-2 text-sm">{post.text}</p>

              {post.attachment && (
<div className="mt-3 rounded-xl overflow-hidden">
        {post.type === "video" ? <VideoPlayer src={post.attachment} /> : <Images src={post.attachment} />}
                </div>
              )}

              <div className="flex justify-between items-center mt-5">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={post.likedByClient}
                    className={`flex items-center space-x-2 text-gray-400 transition ${post.likedByClient ? "text-red-500" : "hover:text-red-400"}`}
                  >
                    <Heart className={`${post.likedByClient ? "fill-red-500" : ""}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button onClick={() => toggleComments(post.id)} className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition">
                    <MessageCircle />
                    <span>{post.comments?.length}</span>
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePin(post.id)}
                    disabled={post.pinnedByClient}
                    className={`flex items-center space-x-2 text-gray-400 transition ${
                      post.pinnedByClient ? "text-orange-500" : "hover:text-orange-400"
                    }`}
                  >
                    <Pin className={`${post.pinnedByClient ? "fill-orange-500" : ""}`} />
                    <span>{post.pins}</span>
                  </button>
                </div>
              </div>

              {visibleComments[post.id] && <CommentSection postId={post.id} onClose={() => toggleComments(post.id)} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;