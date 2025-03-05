import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <NextTopLoader color="#3b82f6" height={3} showSpinner={false} />

        <AuthGuard>
          {children}
        {pathname !== "/login" && <Navigation />}
        </AuthGuard>
      </body>
    </html>
  );
}