import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "메일브릿지 - 이메일 정보 공유 플랫폼",
  description: "이메일로 받은 유용한 정보를 다른 사람들과 쉽게 공유하세요",
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
