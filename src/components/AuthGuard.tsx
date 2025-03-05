"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === "/login") return setIsLoading(false);
        
      const clientUID = localStorage.getItem("clientUID");
      if (!clientUID) return router.replace("/login");
        
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <img src="/logo.png" alt="Logo" width={220} height={60} className="object-contain" />
      </div>
    );

  return <>{children}</>;
};

export default AuthGuard;
