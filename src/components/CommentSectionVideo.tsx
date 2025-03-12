'use client';

import { useState, useEffect, useRef } from 'react';
import { database } from '@/utils/database';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import UserAvatar from "./UserAvatar";
import { useRouter } from "next/navigation";
import { getText } from '@/utils/leiam';

const CommentSection = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [replyLoading, setReplyLoading] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const commentsEndRef = useRef(null);
  const router = useRouter();

  const getClientUID = () => (typeof window !== 'undefined' ? localStorage.getItem('clientUID') : null);

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const fetchComments = async () => {
    try {
      const clientUID = getClientUID();
      if (!clientUID) return;
      const allPosts = await database.commentData(postId);
      setComments(allPosts ?? []);
    } catch (error) {}
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || isPosting) return;
    setIsPosting(true);
    const clientUID = getClientUID();
    if (!clientUID) return;

    try {
      const user = await database.getUserData(clientUID);
      const filter = await getText(commentText.trim());
      
      const newComment = {
        uid: user?.id,
        id: postId,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        username: user?.name,
        section: user?.section,
        grade: user?.grade,
        icon: user?.icon,
        text: filter,
        replies: [],
      };

      setComments((prev) => [...prev, newComment]);
      await database.addComment(newComment);
      setCommentText('');
      scrollToBottom();
    } catch (error) {} finally {
      setIsPosting(false);
    }
  };

  const handleReplySubmit = async (commentDate: string) => {
    if (!replyText[commentDate]?.trim() || replyLoading[commentDate]) return;
    setReplyLoading((prev) => ({ ...prev, [commentDate]: true }));
    const clientUID = getClientUID();
    if (!clientUID) return;

    try {
      const user = await database.getUserData(clientUID);
      const filter = await getText(replyText[commentDate].trim());
      
      const newReply = {
        commentId: postId,
        uid: user?.id,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        username: user?.name,
        section: user?.section,
        grade: user?.grade,
        icon: user?.icon,
        text: filter,
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.date === commentDate
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );

      setReplyText((prev) => ({ ...prev, [commentDate]: '' }));
      await database.replyComment(newReply);
      scrollToBottom();
    } catch (error) {} finally {
      setReplyLoading((prev) => ({ ...prev, [commentDate]: false }));
    }
  };

  const toggleReplies = (commentDate: string) => {
    setExpandedReplies((prev) => ({ ...prev, [commentDate]: !prev[commentDate] }));
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full h-[50vh] bg-[#131313] shadow-lg rounded-t-lg transition-transform z-50 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}>      
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">Comments</h1>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.date} className="bg-[#0f0f0f] rounded-2xl p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <UserAvatar userId={comment.uid} onClick={() => navigateToProfile(comment.uid)} />
                <div className="flex-1">
                  <p className="text-sm font-bold">{comment.username} <span className="text-gray-400">{comment.section} {comment.grade}</span></p>
                  <p className="text-sm mt-1 text-gray-300">{comment.text}</p>
                  <button onClick={() => toggleReplies(comment.date)} className="text-gray-400 hover:text-gray-600 mt-2 flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span className="text-xs">{expandedReplies[comment.date] ? 'Hide replies' : `Reply (${comment.replies?.length})`}</span>
                  </button>
                  {expandedReplies[comment.date] && (
                    <div className="ml-6 mt-2 border-l-2 border-gray-700 pl-4">
                      {comment.replies.map((reply) => (
          <div key={reply.date} className="mt-4">
            <p className="text-xs font-bold">{reply.username}</p>
            <p className="text-xs text-gray-300">{reply.text}</p>
                        </div>
                      ))}
                      <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto mt-7">
                        <textarea
                          className="flex-1 bg-transparent text-white outline-none px-2"
                          placeholder="Write a reply..."
                          value={replyText[comment.date] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [comment.date]: e.target.value })}
                        />
                        <button onClick={() => handleReplySubmit(comment.date)} className="p-2 bg-white text-black rounded-full">
                          {replyLoading[comment.date] ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
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
        <div ref={commentsEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full px-4 pb-4 bg-black">
        <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
          <textarea
            className="flex-1 bg-transparent text-white outline-none px-2"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleCommentSubmit} className="p-2 bg-white text-black rounded-full">
            {isPosting ? <Loader2 size={23} className="animate-spin" /> : <Send size={23} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;