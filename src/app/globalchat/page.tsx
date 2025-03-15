"use client";

import { useEffect, useState, useRef } from "react";
import { upload } from "@/utils/upload";
import { database } from "@/utils/database";
import { Send, CloudUpload, File, Download, X, Loader2 } from "lucide-react";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import { getText } from "@/utils/leiam";
import Images from "@/components/ImgChat";

const GlobalChat = () => {
  const router = useRouter();
  const senderID = localStorage.getItem("clientUID");
  if (!senderID) return null;

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

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
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

  const sendMessage = async () => {
    if (!message.trim() && !attachment) return;
    if (cooldown) return;

    setSending(true);

    const user = await database.getUserData(senderID);
    const filter = await getText(message);

    let uploadedUrl = attachment;
    if (attachment) uploadedUrl = await upload(attachment);

    const newMessage = {
      senderID,
      name: user.name,
      grade: user.grade,
      strand: user.strand,
      section: user.section,
      time: new Date().toISOString(),
      type: attachment ? attachmentType : "text",
      attachment: uploadedUrl,
      message: filter,
    };

    await database.globalChat(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setAttachment(null);
    setAttachmentType(null);
    setSending(false);
    setCooldown(true);
    setCooldownTime(10);
    setShouldScroll(true);

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

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAttachment(url);

    if (file.type.startsWith("image")) {
      setAttachmentType("image");
    } else if (file.type.startsWith("video")) {
      setAttachmentType("video");
    } else {
      setAttachmentType("file");
    }
  };

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 pb-20 flex flex-col">
      <div className="text-white pt-6 text-lg font-bold px-4 mb-3">GlobalChat</div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto py-2 space-y-3 pb-20 mb-3">
        {loading ? (
          <div className="text-gray-400 text-center mt-5">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-5">Start your conversation</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderID === senderID ? "justify-end" : "justify-start"}`}>
              {msg.senderID !== senderID && (
                <div className="mr-2 flex flex-col items-center">
                  <Icon userId={msg.senderID} onClick={() => navigateToProfile(msg.senderID)} />
                </div>
              )}
              <div className="flex flex-col max-w-[75%]">
                {msg.senderID !== senderID && <p className="text-xs text-gray-400 mb-1">{msg.name}</p>}
                <div className={`p-3 rounded-2xl ${msg.senderID === senderID ? "bg-gray-800 text-white" : "bg-[#1E1E1E] text-gray-300"} shadow-md`}>
      <p className="text-lg">{msg.message}</p>
                  {msg.attachment && (
                    msg.type === "image" ? (
                      <Images src={msg.attachment} />
                    ) : msg.type === "video" ? (
                      <video src={msg.attachment} controls className="rounded-lg w-full max-w-xs" />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <File size={60} className="text-gray-400" />
                        <a
                          href={msg.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 truncate"
                        >
                          {msg.attachment.replace("https://raw.githubusercontent.com/LeiamNashRebirth/storage/main/leiamnash_", "")}
                        </a>
                        <a href={msg.attachment} download>
                          <Download size={20} className="text-white" />
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {attachment && (
        <div className="fixed rounded-lg bottom-16 left-0 right-0 w-full px-4 pb-20 mb-12">
          <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
          {attachmentType === "image" ? (
            <img src={attachment} alt="Preview" className="w-40 h-full rounded-lg" />
          ) : attachmentType === "video" ? (
            <video src={attachment} controls className="w-40 h-full rounded-lg" />
          ) : (
<div className="flex items-center space-x-2">
  <File size={24} className="text-gray-400" />
              <span className="text-gray-400 truncate w-32">{attachment.replace("blob:https://stemxchange.vercel.app/", "")}</span>
              <button onClick={() => setAttachment(null)} className="text-red-500">
                <X size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 w-full px-4 mb-7">
        <div className="flex items-center bg-[#262626] p-3 rounded-xl w-full max-w-2xl mx-auto">
          <button onClick={() => fileInputRef.current?.click()} className="text-gray-400">
            <CloudUpload size={24} />
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

          <button className={`ml-2 p-2 rounded-full ${cooldown ? "opacity-50 cursor-not-allowed bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`} onClick={sendMessage} disabled={cooldown}>
            {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;