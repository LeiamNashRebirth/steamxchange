"use client";

import Link from "next/link";
import { Link2Off } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 pb-20">
      <div className="w-full max-w-2xl flex flex-col items-center text-center px-4">
  <Link2Off className="w-12 h-12 text-gray-500" />
        <h1 className="text-3xl font-bold mt-4">This page isn’t available</h1>
        <p className="text-gray-400 mt-2">
          It looks like you followed a broken link. Make sure the URL is correct or return to the home page.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#262626] text-white font-semibold rounded-full hover:bg-[#0f0f0f] transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
