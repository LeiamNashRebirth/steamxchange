"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { database } from "@/utils/database";
import { Star, StarOff, MessageCircle, Pin, FileText, Download } from "lucide-react";
import PostForm from "@/components/PostFormDiscussion";
import CommentSection from "@/components/CommentSectionDiscuss";
import UserAvatar from "@/components/UserAvatar";
import Images from "@/components/Images";
import VideoPlayer from "@/components/VideoPlayer";

const Discussions = () => {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchDiscussions = async () => {
      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) return;

      const allDiscussions = await database.getDiscussionData();
      setDiscussions(
        allDiscussions.map((discussion: any) => ({
          ...discussion,
          likedByClient: discussion.liked.includes(clientUID),
          dislikedByClient: discussion.disliked.includes(clientUID) || false,
          pinnedByClient: discussion.pinned.includes(clientUID) || false,
        }))
      );
      setLoading(false);
    };

    fetchDiscussions();
  }, [router]);

  const handleLike = async (discussionId: string) => {
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    try {
      const updatedDiscussion = await database.likeDiscussion(discussionId, clientUID);
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId ? { ...d, likes: updatedDiscussion.likes, likedByClient: true, dislikedByClient: false } : d
        )
      );
    } catch (error) {}
  };

  const handleDislike = async (discussionId: string) => {
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    try {
      const updatedDiscussion = await database.dislikeDiscussion(discussionId, clientUID);
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId ? { ...d, dislikes: updatedDiscussion.dislikes, dislikedByClient: true, likedByClient: false } : d
        )
      );
    } catch (error) {}
  };

  const handlePin = async (discussionId: string) => {
    const clientUID = localStorage.getItem("clientUID");
    if (!clientUID) return;

    try {
      const updatedDiscussion = await database.addPinDiscussion(clientUID, discussionId);
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussionId ? { ...d, pins: updatedDiscussion.pins, pinnedByClient: true } : d
        )
      );
    } catch (error) {}
  };

  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const toggleComments = (discussionId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-6 pt-6">
        <PostForm setPosts={setDiscussions} />

        {loading ? (
          <div className="flex justify-center py-10 text-lg">Loading...</div>
        ) : (
          discussions.map((discussion) => (
            <div key={discussion.id} className="bg-[#0f0f0f] rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <UserAvatar userId={discussion.uid} onClick={() => navigateToProfile(discussion.uid)} />
                  <div>
                    <p className="text-white font-semibold" onClick={() => navigateToProfile(discussion.uid)}>
                      {discussion.username}
                    </p>
                    <p className="text-gray-400 text-sm">{discussion.grade} {discussion.section}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{formatDateTime(discussion.date)}</p>
              </div>

              <h2 className="text-white text-lg font-bold">{discussion.title}</h2>
              <p className="text-gray-300 mt-2">{discussion.question}</p>

              {discussion.type !== "text" && discussion.attachment.length > 0 && (
                <div className="mt-3">
                  {discussion.type.startsWith("image") ? (
                    <Images src={discussion.attachment} />
                  ) : discussion.type.startsWith("video") ? (
                    <VideoPlayer src={discussion.attachment} />
      ) : discussion.type === "file" ? (
    <div className="flex items-center space-x-2">
      <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
<FileText size={25} className="text-gray-300" />

  <div className="overflow-hidden text-ellipsis">
      <a
        href={discussion.attachment}
        className="text-gray-400"
        target="_blank"
      >{discussion.attachment.replace("https://raw.githubusercontent.com/LeiamNashRebirth/storage/main/leiamnash_", "  ")} </a>
                      </div>
        <a href={discussion.attachment} download>
          <Download size={20} className="text-white" />
                            </a>
                     </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex justify-between items-center mt-5">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(discussion.id)}
                    disabled={discussion.likedByClient}
                    className={`flex items-center space-x-2 text-gray-400 transition ${
                      discussion.likedByClient ? "text-yellow-500" : "hover:text-yellow-400"
                    }`}
                  >
                    <Star className={discussion.likedByClient ? "fill-yellow-500" : ""} />
                    <span>{discussion.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(discussion.id)}
                    disabled={discussion.dislikedByClient}
                    className={`flex items-center space-x-2 text-gray-400 transition ${
                      discussion.dislikedByClient ? "text-red-500" : "hover:text-red-400"
                    }`}
                  >
                    <StarOff className={discussion.dislikedByClient ? "fill-red-500" : ""} />
                    <span>{discussion.dislikes}</span>
                  </button>

                  <button onClick={() => toggleComments(discussion.id)} className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition">
                    <MessageCircle />
                    <span>{discussion.comments?.length}</span>
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePin(discussion.id)}
                    disabled={discussion.pinnedByClient}
                    className={`flex items-center space-x-2 text-gray-400 transition ${
                      discussion.pinnedByClient ? "text-orange-500" : "hover:text-orange-400"
                    }`}
                  >
                    <Pin className={`${discussion.pinnedByClient ? "fill-orange-500" : ""}`} />
                    <span>{discussion.pins}</span>
                  </button>
                </div>
              </div>


              {visibleComments[discussion.id] && <CommentSection postId={discussion.id} onClose={() => toggleComments(discussion.id)} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discussions;