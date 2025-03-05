import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import NextTopLoader from "nextjs-toploader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <NextTopLoader color="#3b82f6" height={3} showSpinner={false} />

        <AuthGuard>
          {children}
          <Navigation />
        </AuthGuard>
      </body>
    </html>
  );
}