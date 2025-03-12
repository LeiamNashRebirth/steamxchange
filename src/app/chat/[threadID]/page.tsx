"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { database } from "@/utils/database";
import { upload } from "@/utils/upload";
import { ArrowLeft, Send, File, Image, Video } from "lucide-react";

const ChatThread = () => {
  const router = useRouter();
  const { threadID } = useParams<{ threadID: string }>();
  const senderID = localStorage.getItem("clientUID");
  if (!senderID) return;
  localStorage.setItem('threadID', senderID);
  localStorage.setItem('senderID', threadID);

  let sID: string;
  let tID: string;
  
  sID = localStorage.getItem("senderID");
  tID = localStorage.getItem("threadID");

  const SID = sID + tID;
  const TID = tID + sID;

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threadID) return;
    const fetchMessages = async () => {
      const result = await database.dataThread(SID, TID);
      setMessages(result || []);
      setLoading(false);
    };
    fetchMessages();
  }, [threadID]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAttachment(file);
    if (file.type.startsWith("image/")) {
      setAttachmentPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      setAttachmentPreview(URL.createObjectURL(file));
    } else {
      setAttachmentPreview(file.name);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !attachment) return;
    setSending(true);

    const user = await database.getUserData(senderID);
    let attachmentUrl = null;

    if (attachment) {
      attachmentUrl = await upload(URL.createObjectURL(attachment));
    }

   await database.chatThread({
      senderID: SID, 
      threadID: TID, 
      uid: senderID,
      name: user.name,
      grade: user.grade,
      strand: user.strand,
      date: new Date().toISOString(),
      type: attachment ? "attachment" : "message",
      attachment: attachmentUrl,
      message: sID,
    });

    setMessage("");
    setAttachment(null);
    setAttachmentPreview(null);
    setSending(false);

    const result = await database.dataThread(SID, TID);
    setMessages(result || []);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <button onClick={() => router.back()} className="text-white text-lg mr-4">
          <ArrowLeft size={24} />
        </button>
        <ThreadUser userID={threadID as string} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-10 bg-gray-800 rounded-lg w-2/3"></div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Start your conversation
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.uid === senderID ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[70%] ${msg.uid === senderID ? "bg-blue-600" : "bg-gray-800"}`}>
                {msg.attachment && msg.attachment.startsWith("http") ? (
          msg.attachment.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img src={msg.attachment} alt="Attachment" className="rounded-lg mb-2 max-w-full h-auto" />
                  ) : msg.attachment.match(/\.(mp4|webm|ogg)$/) ? (
                    <video src={msg.attachment} controls className="rounded-lg mb-2 max-w-full h-auto" />
                  ) : (
                    <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                      {msg.attachment}
                    </a>
                  )
                ) : null}
                <p>{msg.message}</p>
                <p className="text-gray-400 text-xs">{new Date(msg.date).toLocaleTimeString()}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Attachment Preview */}
      {attachmentPreview && (
        <div className="p-3 border-t border-gray-700 bg-gray-900 flex items-center">
          {attachment.type.startsWith("image/") ? (
            <img src={attachmentPreview} alt="Attachment" className="rounded-lg max-w-20 h-auto mr-2" />
          ) : attachment.type.startsWith("video/") ? (
            <video src={attachmentPreview} controls className="rounded-lg max-w-20 h-auto mr-2" />
          ) : (
            <p className="text-gray-400">{attachmentPreview}</p>
          )}
          <button onClick={() => setAttachmentPreview(null)} className="ml-auto text-red-400">Remove</button>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700 flex bg-gray-900 fixed bottom-0 w-full">
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          id="file-upload"
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload" className="p-2 text-gray-400 cursor-pointer">
          <File size={24} />
        </label>
        <input
          className="flex-1 bg-gray-800 text-white p-2 rounded-lg outline-none mx-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-600 rounded-lg relative">
          {sending ? <span className="loader"></span> : <Send size={24} />}
        </button>
      </div>
    </div>
  );
};

const ThreadUser = ({ userID }: { userID: string }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await database.getUserData(userID);
      setUser(result);
    };
    fetchUser();
  }, [userID]);

  return user ? (
    <div className="flex items-center space-x-2">
      <img src={user.icon} alt="User Icon" className="w-8 h-8 rounded-full" />
      <p className="text-white font-medium">{user.name}</p>
    </div>
  ) : (
    <p className="text-gray-400">Loading...</p>
  );
};

export default ChatThread;