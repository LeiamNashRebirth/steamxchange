'use client';

import { useState, useEffect } from 'react';
import { database } from '@/utils/database';
import { X, Send, MessageCircle } from 'lucide-react';
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/navigation";

const CommentSection = ({ postId, onClose }: { postId: string; onClose: () => void }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [isPosting, setIsPosting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const getClientUID = () => (typeof window !== 'undefined' ? localStorage.getItem('clientUID') : null);

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const fetchComments = async () => {
    try {
      const clientUID = getClientUID();
      if (!clientUID) return;
      const allPosts = await database.getFeedData();
      const post = allPosts.find((post: any) => post.id === postId);
      setComments(post?.comments ?? []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);
    const clientUID = getClientUID();
    if (!clientUID) return;

    try {
      const user = await database.getUserData(clientUID);
      const newComment = {
        uid: user?.id,
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        username: user?.name,
        section: user?.section,
        grade: user?.grade,
        icon: user?.icon,
        text: commentText.trim(),
        replies: [],
      };

      setComments((prev) => [...prev, newComment]);
      await database.addFeedComment(postId, newComment);
      setCommentText;
    } catch (error) {} finally {
      setIsPosting(false);
    }
  };

  const handleReplySubmit = async (commentDate: string) => {
    if (!replyText.trim()) return;
    setIsPosting(true);
    const clientUID = getClientUID();
    if (!clientUID) return;

    try {
      const user = await database.getUserData(clientUID);
      const newReply = {
        uid: user?.id,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        username: user?.name,
        section: user?.section,
        grade: user?.grade,
        icon: user?.icon,
        text: replyText.trim(),
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.date === commentDate
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );

      setReplyText('');
      await database.replyFeedComment(postId, commentDate, newReply);
    } catch (error) {} finally {
      setIsPosting(false);
    }
  };

  const toggleReplies = (commentDate: string) => {
    setExpandedReplies((prev) => ({ ...prev, [commentDate]: !prev[commentDate] }));
  };

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const options = { month: 'short', day: 'numeric', year: 'numeric' } as const;
    return `${date.toLocaleDateString(undefined, options)} • ${date.toLocaleTimeString()}`;
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 text-white z-50 flex flex-col transition-transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <h1 className="text-lg font-bold">Comments</h1>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-gray-400 hover:text-gray-200">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.date} className="mb-6 border-b border-gray-800 pb-4">
              <div className="flex items-start space-x-3">
          <UserAvatar userId={comment.uid} onClick={() => navigateToProfile(comment.uid)} />
                <div className="flex-1">
                  <p className="text-sm font-bold">{comment.username} <span className="text-gray-500">{comment.section} {comment.grade}</span></p>
                  <p className="text-sm mt-1">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(comment.date)}</p>
                  <button onClick={() => toggleReplies(comment.date)} className="text-blue-500 hover:underline mt-2 flex items-center space-x-1">
<MessageCircle size={16} />
                    <span className="text-xs">{expandedReplies[comment.date] ? 'Hide replies' : `Reply (${comment.replies?.length})`}</span>
                  </button>
                  {expandedReplies[comment.date] && (
            <div className="mt-4">
                {comment.replies?.length > 0 ? (
                        comment.replies.map((reply) => (
                          <div key={reply.date} className="flex items-start space-x-3 mb-3">
        <UserAvatar userId={reply.uid} onClick={() => navigateToProfile(reply.uid)} />
                            <div className="flex-1">
                              <p className="text-sm font-bold">{reply.username} <span className="text-gray-500">{reply.section} {reply.grade}</span></p>
                              <p className="text-sm mt-1">{reply.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDateTime(reply.date)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Be the first to reply to this comment.</p>
                      )}
                      <div className="flex items-center mt-3 space-x-2">
                        <textarea className="w-full p-2 bg-gray-800 text-white rounded-lg resize-none placeholder-gray-400" rows={1} placeholder="Post your reply" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                        <button onClick={() => handleReplySubmit(comment.date)} className={`${isPosting ? 'opacity-50 pointer-events-none' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}>
                          {isPosting ? 'Posting...' : <Send size={18} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 px-4 py-3 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <textarea className="w-full p-3 bg-gray-800 text-white rounded-lg resize-none placeholder-gray-400" rows={1} placeholder="Tweet your reply" value={commentText} onChange={(e) => setCommentText(e.target.value)} disabled={isPosting} />
          <button onClick={handleCommentSubmit} className={`${isPosting ? 'opacity-50 pointer-events-none' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}>
            {isPosting ? 'Posting...' : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
