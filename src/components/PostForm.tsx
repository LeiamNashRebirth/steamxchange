'use client';

import { useState, useEffect } from 'react';
import { database } from '@/utils/database';
import Notification from './Notification';
import VideoPlayer from './VideoPlayer';
import Profile from './Profile';
import { X, Image, Video } from 'lucide-react';
import { upload } from '@/utils/upload';

interface PostFormProps {
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}

const PostForm = ({ setPosts }: PostFormProps) => {
  const [text, setText] = useState('');
  const [profileIcon, setProfileIcon] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const clientUID = localStorage.getItem('clientUID');
      if (clientUID) {
        const userData = await database.getUserData(clientUID);
        setProfileIcon(userData.icon);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const handlePost = async () => {
    const clientUID = localStorage.getItem('clientUID');
    if (!clientUID) return;

    if (cooldown > 0) {
      setNotification({ message: `Please wait ${cooldown}s before posting again.`, type: 'error' });
      return;
    }

    const userData = await database.getUserData(clientUID);
    const { section, name, grade, icon } = userData;

    if (!text.trim() || isPosting) return;

    setIsPosting(true);
    const rawUrl = await upload(mediaPreview);

    const newPostData = {
      id: crypto.randomUUID(),
      uid: clientUID,
      username: name,
      icon,
      section,
      grade,
      time: new Date().toLocaleTimeString(),
      date: new Date().toISOString(),
      text,
      attachment: rawUrl,
      type: mediaType,
    };

    const result = await database.postFeed(newPostData);

    if (result) {
      setPosts((prevPosts) => [newPostData, ...prevPosts]);
      setText('');
      setMediaType(null);
      setMediaPreview(null);
      setCooldown(60);
    } else {
      setNotification({ message: 'Failed to create post. Please try again later.', type: 'error' });
    }

    setIsPosting(false);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(fileType);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full bg-[#15202B] max-w-xl mx-auto p-4 rounded-xl shadow-md">
      <div className="flex items-start space-x-4">
        <Profile src={profileIcon} alt="Profile" />
        <div className="flex-1">
          <textarea
            className="w-full bg-[#192734] text-white p-3 rounded-xl resize-none focus:outline-none placeholder-gray-500"
            rows={3}
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {mediaPreview && (
      <div className="relative mb-4 max-w-full mx-auto">
              {mediaType === 'image' ? (
              <img src={mediaPreview} alt="Preview" className="w-full max-h-[400px] object-contain rounded-lg" />
              ) : (
                <div className="w-full">
            <VideoPlayer src={mediaPreview} />
                </div>
              )}
              <button
                onClick={() => {
                  setMediaType(null);
                  setMediaPreview(null);
                }}
                className="absolute top-2 right-2 bg-[#192734] bg-opacity-50 hover:bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-3">
              <label className="cursor-pointer text-[#1DA1F2] hover:text-white">
                <Image className="w-6 h-6" />
                <input type="file" accept="image/*" className="hidden" onChange={handleMediaChange} />
              </label>
              <label className="cursor-pointer text-[#1DA1F2] hover:text-white">
                <Video className="w-6 h-6" />
                <input type="file" accept="video/*" className="hidden" onChange={handleMediaChange} />
              </label>
            </div>
            <button
              onClick={handlePost}
              className={`px-4 py-2 rounded-full font-bold ${
                isPosting || cooldown > 0 || !text.trim()
                  ? 'bg-[#38444D] text-gray-500 cursor-not-allowed'
                  : 'bg-[#1DA1F2] hover:bg-[#1A91DA] text-white'
              }`}
              disabled={isPosting || cooldown > 0 || !text.trim()}
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default PostForm;
