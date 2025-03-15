"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Feed from "@/components/Feed";
import Discussions from "@/components/Discussion";

const HomePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"discussion" | "feed">("discussion");

  return (
    <div className="min-h-screen bg-black text-white px-4 pb-20">

      <div className="flex items-center justify-between pt-6">
        <h1 className="text-white text-lg font-bold">Home</h1>
        <button onClick={() => router.push("/notification")} className="text-gray-400 hover:text-white transition">
          <Bell size={24} />
        </button>
      </div>

      <div className="flex justify-around border-b border-gray-700 mt-4">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "discussion" ? "text-white border-b-2 border-white font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("discussion")}
        >
          Discussions
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "feed" ? "text-white border-b-2 border-white font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
      </div>

      <div className="pt-6">
        {activeTab === "discussion" ? <Discussions /> : <Feed />}
      </div>
    </div>
  );
};

export default HomePage;