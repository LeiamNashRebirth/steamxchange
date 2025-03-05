"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, User } from "lucide-react";

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
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center py-3">
      <Link href="/" className="flex flex-col items-center">
        <Home className={`w-6 h-6 ${pathname === "/home" ? "text-blue-400" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/home" ? "text-blue-400" : "text-gray-400"}`}>Home</span>
      </Link>

      <Link href="/video" className="flex flex-col items-center">
        <Video className={`w-6 h-6 ${pathname === "/video" ? "text-blue-400" : "text-gray-400"}`} />
        <span className={`text-xs ${pathname === "/video" ? "text-blue-400" : "text-gray-400"}`}>Video</span>
      </Link>

      {uid && (
        <Link href={`/profile/${uid}`} className="flex flex-col items-center">
          <User className={`w-6 h-6 ${pathname.startsWith("/profile") ? "text-blue-400" : "text-gray-400"}`} />
          <span className={`text-xs ${pathname.startsWith("/profile") ? "text-blue-400" : "text-gray-400"}`}>Profile</span>
        </Link>
      )}
    </div>
  );
};

export default Navigation;