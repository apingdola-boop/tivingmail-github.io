import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MailBridge - 이메일 공유 플랫폼",
  description: "Gmail에서 특정 키워드가 포함된 이메일을 자동으로 공유 채널에 게시합니다.",
  icons: {
    icon: "/bridge.png",
    apple: "/bridge.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="nNeqCNf-nmlv15nmZOPzPpA1fwIBpiZ6VITs4ArSEMY" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
