'use client';

import { useState, useEffect } from 'react';
import { database } from '@/utils/database';
import Notification from './Notification';
import VideoPlayer from './VideoPlayer';
import Profile from './Profile';
import { X, Image, Video, FileText, File } from 'lucide-react';
import { upload } from '@/utils/upload';
import { getText } from '@/utils/leiam';

const PostForm = ({ setPosts }: { setPosts: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [profileIcon, setProfileIcon] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'file' | 'text' | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

    if (!title.trim() || !question.trim()) {
      setNotification({ message: 'Title and question are required.', type: 'error' });
      return;
    }

    setIsPosting(true);

    // Upload images
    let imageUrls: string[] = [];
    for (const file of imageFiles) {
      const url = await upload(URL.createObjectURL(file));
      imageUrls.push(url);
    }

    // Upload video
    let videoUrl: string | null = null;
    if (videoPreview) {
      videoUrl = await upload(videoPreview);
    }

    let fileUrl: string | null = null;
    if (filePreview) {
      fileUrl = await upload(filePreview);
    }

    const filteredQuestion = await getText(question);

    const newDiscussionData = {
      id: crypto.randomUUID(),
      uid: clientUID,
      username: name,
      icon,
      section,
      grade,
      title: title.trim(),
      question: filteredQuestion,
      time: new Date().toLocaleTimeString(),
      date: new Date().toISOString(),
      attachment: videoUrl || fileUrl || imageUrls,
      type: mediaType,
    };

    const result = await database.postDiscussion(newDiscussionData);

    if (result) {
      setPosts((prevPosts) => [newDiscussionData, ...prevPosts]);
      setTitle('');
      setQuestion('');
      setMediaType(null);
      setImagePreviews([]);
      setImageFiles([]);
      setVideoPreview(null);
      setCooldown(60);
    } else {
      setNotification({ message: 'Failed to create discussion. Please try again later.', type: 'error' });
    }

    setIsPosting(false);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const file = files[0];
 if (file.type.startsWith('video/')) {
        setMediaType('video');
  setVideoPreview(URL.createObjectURL(file));
  } else if (file.type.startsWith('image/')) {
        setMediaType('image');
        setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
        setImageFiles((prev) => [...prev, ...files]);
  } else if (!file.type) {
        setMediaType('text');
  } else {
        setMediaType('file');
    setFilePreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-[#0f0f0f] rounded-2xl p-4 shadow-lg">
      <div className="flex items-start space-x-4">
        <Profile src={profileIcon} alt="Profile" />
        <div className="flex-1">
          <input
            className="w-full bg-[#262626] text-white p-3 rounded-xl focus:outline-none placeholder-gray-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-[#262626] text-white p-3 mt-2 rounded-xl resize-none focus:outline-none placeholder-gray-500"
            rows={3}
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-400 hover:bg-red-500 text-black rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Video Preview */}
          {videoPreview && (
            <div className="relative mt-4">
              <VideoPlayer src={videoPreview} />
              <button
                onClick={() => setVideoPreview(null)}
                className="absolute top-2 right-2 bg-gray-400 hover:bg-red-500 text-black rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* File Preview */}
          {filePreview && (
            <div className="relative mt-4 flex items-center space-x-2">
              <File size={24} className="text-gray-400" />
              <span className="text-gray-400 truncate max-w-[150px]">{filePreview}</span>
              <button
                onClick={() => setFilePreview(null)}
                className="bg-gray-400 hover:bg-red-500 text-black rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-3">
              <label className="cursor-pointer text-gray-400">
                <Image className="w-6 h-6" />
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleMediaChange} />
              </label>
              <label className="cursor-pointer text-gray-400">
                <Video className="w-6 h-6" />
                <input type="file" accept="video/*" className="hidden" onChange={handleMediaChange} />
              </label>
               <label className="cursor-pointer text-gray-400">
              <FileText className="w-6 h-6" />
              <input type="file" accept="*/*" className="hidden" onChange={handleMediaChange} />
            </label>
            </div>
            <button
              onClick={handlePost}
              className={`px-4 py-2 rounded-full font-bold ${
                isPosting || cooldown > 0 || !title.trim() || !question.trim()
                  ? 'bg-[#262626] text-gray-500 cursor-not-allowed'
                  : 'bg-white hover:bg-white text-black'
              }`}
              disabled={isPosting || cooldown > 0 || !title.trim() || !question.trim()}
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