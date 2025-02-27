import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />;
}
