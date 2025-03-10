'use client';

import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.prefetch(pathname); 
    handleStart(); 

    const timer = setTimeout(() => handleStop(), 700); 
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <NextTopLoader color="#ffffff" height={3} showSpinner={false} showAtBottom={false} />

        {loading && <NextTopLoader color="#ffffff" height={3} showSpinner={false} />}

        <AuthGuard>
          {children}
          {pathname !== "/login" && pathname !== "/create" && <Navigation />}
        </AuthGuard>
      </body>
    </html>
  );
}