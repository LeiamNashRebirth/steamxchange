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

const Home = () => {
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="text-white border-b border-gray-700 p-4 text-lg font-bold">
        Home
      </div>

      <div className="border-b border-gray-700 p-4">
        <PostForm setPosts={setPosts} setPosting={() => {}} />
      </div>

      {loading ? (
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg space-y-4 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="w-32 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="w-full h-4 bg-gray-700 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border-b border-gray-700 hover:bg-gray-900 transition">
              <div className="flex items-start space-x-4">
                <UserAvatar userId={post.uid} onClick={() => navigateToProfile(post.uid)} />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-white cursor-pointer" onClick={() => navigateToProfile(post.uid)}>
                      {post.username}
                    </p>
                    <p className="text-gray-400 text-sm">{post.section} {post.grade}</p>
                  </div>
                  <p className="text-gray-300 mt-1">{post.text}</p>

                  {post.attachment && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      {post.type === "video" ? (
                        <VideoPlayer src={post.attachment} />
                      ) : (
                        <Images src={post.attachment} alt="Post Media" />
                      )}
                    </div>
                  )}

                  <div className="flex text-gray-500 mt-3 gap-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      disabled={post.likedByClient}
                      className={`flex items-center space-x-1 transition ${
                        post.likedByClient ? "text-red-500" : "hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.likedByClient ? "fill-red-500" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1 hover:text-blue-400 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments?.length}</span>
                    </button>
                    <button
                      onClick={() => handlePin(post.id)}
                      disabled={post.pinnedByClient}
                      className={`flex items-center space-x-1 transition ${
                        post.pinnedByClient ? "text-green-500" : "hover:text-green-400"
                      }`}
                    >
                      <Pin className={`w-5 h-5 ${post.pinnedByClient ? "fill-green-500" : ""}`} />
                      <span>{post.pins}</span>
                    </button>

                  </div>

                  {visibleComments[post.id] && <CommentSection postId={post.id} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
