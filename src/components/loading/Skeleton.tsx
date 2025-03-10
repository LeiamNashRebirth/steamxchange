import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#131313] rounded-lg ${className}`} />;
}
