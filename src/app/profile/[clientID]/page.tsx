"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { database } from "@/utils/database";
import EditProfile from "@/components/EditProfile";
import { ArrowLeft, MapPin, CalendarCheck2, Grid2x2Check, GraduationCap } from "lucide-react";
import Image from "@/components/Images";
import VideoPlayer from "@/components/VideoPlayer";

const formatDateTime = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const options: Intl.DateTimeFormatOptions = { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  };
  return date.toLocaleDateString(undefined, options);
};

const Profile = () => {
  const { clientID } = useParams<{ clientID: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [clientData, setClientData] = useState("");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) return;
      setClientData(clientUID);

      const user = await database.getUserData(clientID);
      const posts = await database.getFeedData();

      setUserData(user);
      setAllPosts(posts.filter((post) => post.uid === clientID));
      setIsOwner(clientUID === clientID);
      setLoading(false);
    };

    fetchUserData();
  }, [clientID, router]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="bg-[#0f0f0f] text-white flex items-center px-4 py-3 border-b border-[#0f0f0f]">
        <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-800 transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          {loading ? (
            <div className="h-5 w-32 bg-[#0f0f0f] rounded-md animate-pulse"></div>
          ) : (
            <h1 className="text-lg font-bold">{userData.name}</h1>
          )}
          <p className="text-sm text-gray-400">{allPosts.length} Posts</p>
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="w-full h-48 bg-[#0f0f0f]"></div>
          <div className="relative px-4 pb-4">
            <div className="w-24 h-24 bg-gray-700 rounded-full border-black absolute -top-12 left-4"></div>
            <div className="ml-32 mt-6">
              <div className="h-6 w-40 bg-gray-700 rounded-md"></div>
              <div className="h-4 w-32 bg-gray-700 rounded-md mt-2"></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="relative">
    <div className="w-full h-48 bg-[#262626]">
              {userData.banner && <img src={userData.banner} className="w-full h-full object-cover" />}
            </div>
            <div className="absolute -bottom-12 left-4">
              <img src={userData.icon} className="w-24 h-24 rounded-full border-4 border-black" />
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex justify-between items-center">
              <div className="mt-14">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-gray-400">{userData.bio || "No bio available"}</p>
              </div>
              {isOwner ? (
                <button onClick={() => setEditOpen(true)} className="px-4 py-2 bg-[#262626] hover:bg-[#0f0f0f] rounded-full transition">
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => router.push(`/message/${clientData}/${userData.id}`)} className="px-4 py-2 bg-[#262626] hover:bg-[#0f0f0f] rounded-full transition">
                  Message
                </button>
              )}
            </div>
            <div className="flex items-center text-gray-400 mt-2">
              <MapPin size={18} className="mr-2" />
  {userData.address || "No address available"}
            </div>
            <div className="flex items-center text-gray-400 mt-1">
              <CalendarCheck2 size={18} className="mr-2" />
              Joined {formatDateTime(userData.createdAt)}
            </div>
            <div className="flex items-center text-gray-400 mt-1">
              <Grid2x2Check size={18} className="mr-2" />
              {userData.schoolID || "No schoolID available"}
            </div>
            <div className="flex items-center text-gray-400 mt-1">
              <GraduationCap size={18} className="mr-2" />
              {userData.section} {userData.grade}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 px-4">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0f0f0f] rounded-2xl p-4 shadow-lg mb-4"
            >
        <div className="flex items-center justify-between mb-3 space-x-3">
                <img src={userData.icon} alt="Profile" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{post.username}</span>
                      <span className="text-gray-400 text-sm">{post.section} {post.grade}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDateTime(post.date)}</span>
                  </div>
                </div>
              </div>

<p className="text-white mt-2 text-sm">{post.text}</p>

              {post.attachment && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  {post.type === "image" ? (
                    <Image src={post.attachment} />
                  ) : post.type === "video" ? (
                    <VideoPlayer src={post.attachment} />
                  ) : null}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">No posts yet.</p>
        )}
      </div>

      {editOpen && <EditProfile userData={userData} setEditOpen={setEditOpen} />}
    </div>
  );
};

export default Profile;