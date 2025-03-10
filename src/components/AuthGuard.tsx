"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { database } from "@/utils/database";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/login" || pathname === "/create") {
        setIsLoading(false);
        return;
      }

      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) {
        router.replace("/login");
        return;
      }
 
      const user = await database.getUserData(clientUID);
      if (user?.error) {
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
          <img src="/logo.png" alt="Logo" width={230} height={60} className="object-contain" />
      </div>
    );

  return <>{children}</>;
};

export default AuthGuard;
