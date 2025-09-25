import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./_context/auth-provider";

export const metadata: Metadata = {
  title: "LSSO Admin",
  description: "LSSO 시스템 관리자 패널",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
