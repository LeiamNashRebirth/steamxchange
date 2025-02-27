"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { database } from "@/utils/database";
import { ArrowLeft, Send } from "lucide-react";

const formatDateTime = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export default function ChatPage() {
  const router = useRouter();
  const { Uid, ReceiverId } = useParams<{ Uid: string; ReceiverId: string }>();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (Uid && ReceiverId) {
      fetchMessages();
    }
  }, [Uid, ReceiverId]);

  const fetchMessages = async () => {
    try {
      const response = await database.getChatUser(Uid, ReceiverId);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Uid,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      message,
      type: "text",
      attachment: null,
    };

    try {
      await database.chatUser(Uid, ReceiverId, newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex items-center p-4 border-b border-gray-700">
        <button onClick={() => router.back()} className="text-gray-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="ml-4 text-lg font-bold">@{ReceiverId}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg?.id === Uid ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs p-3 rounded-lg text-sm ${msg?.id === Uid ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"}`}>
              <p>{msg?.message}</p>
              <span className="block text-xs text-gray-400 mt-1">
                {formatDateTime(msg?.date)}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatContainerRef}></div>
      </div>

      <div className="p-4 border-t border-gray-700 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 p-2 rounded-lg outline-none text-white"
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 px-4 py-2 rounded-lg flex items-center">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
