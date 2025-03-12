"use client";

import { useEffect, useState } from "react";
import { database } from "@/utils/database";
import Link from "next/link";
import { MessageSquare, Home, User } from "lucide-react";

const Chat = () => {
  const senderID = localStorage.getItem("clientUID");
    if (!senderID) return;

  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      const result = await database.chatsThread(senderID);
      setChats(result || []);
      setLoading(false);
    };
    fetchChats();
  }, []);

  return (
      <div className="min-h-screen bg-black text-white pb-20">
      <div className="text-white pt-6 text-lg font-bold px-4 mb-3">chats</div>

      {loading ? (
    <div className="flex flex-col space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-grow">
          <p className="text-gray-400">No chat conversations available</p>
        </div>
      ) : (
        <div className="flex flex-col p-4 space-y-3">
          {chats.map((chat) => (
            <Link
              key={chat.threadID}
              href={`/chats/${chat.threadID}`}
              className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <ChatUser userID={chat.threadID} />
              <div className="ml-3">
                <p className="text-white font-medium">{chat.name}</p>
                <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

const ChatUser = ({ userID }: { userID: string }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await database.getUserData(userID);
      setUser(result);
    };
    fetchUser();
  }, [userID]);

  return user ? (
    <img src={user.icon || "/default-avatar.png"} alt="User" className="w-12 h-12 rounded-full" />
  ) : (
    <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
  );
};

const BottomNav = () => (
  <div className="fixed bottom-0 w-full bg-gray-900 p-4 flex justify-around border-t border-gray-700">
    <Link href="/">
      <Home size={24} color="white" />
    </Link>
    <Link href="/chats">
      <MessageSquare size={24} color="white" />
    </Link>
    <Link href="/profile">
      <User size={24} color="white" />
    </Link>
  </div>
);

export default Chat;