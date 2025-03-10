"use client";

import { useEffect, useState } from "react";
import { database } from "@/utils/database";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) return;

      try {
        const data = await database.getNotification(clientUID);
        if (!data) {
          setLoading(false);
          return;
        }

        let userNotifications = [];

        data.liked.forEach((user: any) => {
          userNotifications.push({
            id: `like-${user.id}`,
            type: "like",
            name: user.username,
            icon: user.icon,
            grade: user.grade,
            section: user.section,
          });
        });

        data.pinned.forEach((user: any) => {
          userNotifications.push({
            id: `pin-${user.id}`,
            type: "pin",
            name: user.username,
            icon: user.icon,
            grade: user.grade,
            section: user.section,
          });
        });

        data.comments.forEach((comment: any) => {
          userNotifications.push({
            id: `comment-${comment.id}`,
            type: "comment",
            name: comment.username,
            icon: comment.icon,
            grade: comment.grade,
            section: comment.section,
            text: comment.text,
          });
        });

        data.reply.forEach((reply: any) => {
          userNotifications.push({
            id: `reply-${reply.id}`,
            type: "reply",
            name: reply.username,
            icon: reply.icon,
            grade: reply.grade,
            section: reply.section,
            text: reply.text,
          });
        });

        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#0f0f0f] p-4 rounded-xl flex gap-4 items-center"
          >
            <div className="w-12 h-12 bg-[#262626] rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#262626] w-3/4 rounded"></div>
              <div className="h-4 bg-[#262626] w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 space-y-4 pb-20">
      <div className="text-white pt-6 text-lg font-bold">
        Notification
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-400">No new notifications</div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-[#0f0f0f] p-4 rounded-xl flex gap-4 items-center shadow-lg"
          >
            <img
              src={notif.icon}
              alt="User Icon"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-white">{notif.name}</span>{" "}
                {notif.type === "like"
                  ? "liked your post"
                  : notif.type === "pin"
                  ? "pinned your post"
                  : notif.type === "comment"
                  ? `commented: "${notif.text}"`
                  : `replied: "${notif.text}"`}
              </p>
              <p className="text-gray-400 text-xs">
                Grade {notif.grade} • {notif.section}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}