"use client";

import { useEffect, useState, useRef } from "react";
import { upload } from "@/utils/upload";
import { database } from "@/utils/database";
import { Send, Image, Loader2, X } from "lucide-react";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import { getText } from '@/utils/leiam';

const GlobalChat = () => {
  const router = useRouter();
  const senderID = localStorage.getItem("clientUID");
  if (!senderID) return null;

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setIsAtBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await database.dataGlobalChat();
      setMessages(result || []);
      setLoading(false);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAtBottom || (messages.length > 0 && messages[messages.length - 1].senderID === senderID)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() && !attachment) return;
    if (cooldown) return;

    setSending(true);

    const user = await database.getUserData(senderID);
    const filter = await getText(message);

    const newMessage = {
      senderID,
      name: user.name,
      grade: user.grade,
      strand: user.strand,
      section: user.section,
      time: new Date().toISOString(),
      type: attachment ? "attachment" : "message",
      attachment,
      message: filter,
    };

    await database.globalChat(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setAttachment(null);
    setSending(false);
    setCooldown(true);
    setCooldownTime(10); 

    const countdown = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setCooldown(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAttachment(url);
    const rawUrl = await upload(url);
    setAttachment(rawUrl);
  };

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pb-20 flex flex-col">
    
      <div className="text-white pt-6 text-lg font-bold px-4 mb-3">GlobalChat</div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-2 space-y-3 pb-20 mb-3"
      >
        {loading ? (
          <div className="text-gray-400 text-center mt-5">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-5">Start your conversation</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderID === senderID ? "justify-end" : "justify-start"}`}
            >
              {msg.senderID !== senderID && (
                <div className="mr-2 flex flex-col items-center">
                  <Icon userId={msg.senderID} onClick={() => navigateToProfile(msg.senderID)} />
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                {msg.senderID !== senderID && (
                  <p className="text-xs text-gray-400 mb-1">{msg.name}</p>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    msg.senderID === senderID
                      ? "bg-gray-800 text-white"
                      : "bg-[#1E1E1E] text-gray-300"
                  } shadow-md`}
                >
                  {msg.attachment && msg.type === "attachment" ? (
                    msg.attachment.endsWith(".mp4") ? (
                      <video src={msg.attachment} controls className="mt-2 rounded-lg w-full" />
                    ) : msg.attachment.match(/\.(jpg|jpeg|png|gif)$/) ? (
                      <img
                        src={msg.attachment}
                        alt="Attachment"
                        className="mt-2 rounded-lg w-full"
                      />
                    ) : (
                      <a
                        href={msg.attachment}
                        target="_blank"
                        className="mt-2 text-gray-400 underline"
                      >
                        {msg.attachment}
                      </a>
                    )
                  ) : (
                    <p className="text-lg">{msg.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {attachment && (
        <div className="p-4 bg-gray-900 flex items-center">
          {attachment.endsWith(".mp4") ? (
            <video src={attachment} controls className="w-32 h-32 rounded-lg" />
          ) : attachment.match(/\.(jpg|jpeg|png|gif)$/) ? (
            <img src={attachment} alt="Preview" className="w-32 h-32 rounded-lg" />
          ) : (
            <a href={attachment} target="_blank" className="text-gray-400 truncate">
              {attachment}
            </a>
          )}
          <button className="ml-4 text-red-500" onClick={() => setAttachment(null)}>
            <X size={24} />
          </button>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 w-full px-4 mb-7">
        <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
          <button onClick={() => fileInputRef.current?.click()} className="text-gray-400">
            <Image size={24} />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

          <input
            type="text"
            className="flex-1 bg-transparent text-white outline-none px-2"
            placeholder={cooldown ? `Cooling down ${cooldownTime}` : "Message"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={cooldown}
          />

          <button
            className={`ml-2 p-2 rounded-full transition ${
              cooldown
                ? "opacity-50 cursor-not-allowed bg-gray-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={sendMessage}
            disabled={cooldown}
          >
            {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;