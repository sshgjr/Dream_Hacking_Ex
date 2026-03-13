import type { Metadata } from "next";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Dream Hacking — AI 꿈 해몽",
  description: "AI가 분석하는 당신의 꿈 이야기. 꿈의 의미, 주의사항, 좋은 징조를 알려드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="grain-overlay antialiased">
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
