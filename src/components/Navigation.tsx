"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, User, Bot, MessageCircleMore } from "lucide-react";

const Navigation = () => {
  const [uid, setUid] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const clientUID = localStorage.getItem("clientUID");
    if (clientUID) {
      setUid(clientUID);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0f0f0f] border-t border-[#0f0f0f] flex justify-around items-center py-3">
      <Link href="/" className="flex flex-col items-center">
        <Home className={`w-6 h-6 ${pathname === "/home" ? "text-white" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/home" ? "text-white" : "text-gray-400"}`}>Home</span>
      </Link>

      <Link href="/video" className="flex flex-col items-center">
        <Video className={`w-6 h-6 ${pathname === "/video" ? "text-white" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/video" ? "text-white" : "text-gray-400"}`}>Video</span>
      </Link>

      <Link href="/ai" className="flex flex-col items-center">
        <Bot className={`w-6 h-6 ${pathname === "/ai" ? "text-white" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/ai" ? "text-white" : "text-gray-400"}`}>Bot</span>
      </Link>

      <Link href="/globalchat" className="flex flex-col items-center">
        <MessageCircleMore className={`w-6 h-6 ${pathname === "/globalchat" ? "text-white" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/globalchat" ? "text-white" : "text-gray-400"}`}>GlobalChat</span>
      </Link>

      {uid && (
        <Link href={`/profile/${uid}`} className="flex flex-col items-center">
          <User className={`w-6 h-6 ${pathname.startsWith("/profile") ? "text-white" : "text-gray-400"}`} />
          <span className={`text-xs ${pathname.startsWith("/profile") ? "text-white" : "text-gray-400"}`}>Profile</span>
        </Link>
      )}
    </div>
  );
};

export default Navigation;