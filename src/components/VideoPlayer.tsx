'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 1500);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Play error:", error));
      }
    }
  };


  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percent);
    setCurrentTime(formatTime(videoRef.current.currentTime));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  return (
    <div
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full max-h-[400px] object-contain rounded-lg"
        onTimeUpdate={handleProgress}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(formatTime(videoRef.current.duration));
        }}
      />

      {!isPlaying && (
      <button
        className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
        onClick={togglePlay}
      >
        <Play className="w-6 h-6" />
      </button>
      )}

      {showControls && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 px-3 py-1 rounded-full flex items-center justify-between">
          <span className="text-white text-xs">{currentTime}</span>
          <div
            ref={progressRef}
            className="flex-grow h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer mx-3"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-white text-xs mx-3">{duration}</span>
          <button onClick={toggleMute} className="text-white">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
