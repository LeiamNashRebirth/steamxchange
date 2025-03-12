'use client';

import { useState, useEffect } from "react";
import { database } from "@/utils/database"; 

const Icon = ({ userId, onClick }) => {
  const [iconUrl, setIconUrl] = useState(null);

  useEffect(() => {
    const fetchIcon = async () => {
      const user = await database.getUserData(userId);
      if (user && user.icon) {
        setIconUrl(user.icon);
      }
    };
    fetchIcon();
  }, [userId]);

  if (!iconUrl) {
    return (
      <div
        className="w-10 h-10 bg-gray-700 animate-pulse rounded-full cursor-pointer"
        onClick={onClick}
      ></div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt="User Icon"
      className="w-10 h-10 rounded-full cursor-pointer"
      onClick={onClick}
    />
  );
};

export default Icon;
