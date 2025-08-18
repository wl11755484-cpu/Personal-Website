import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的日常",
  description: "私密的个人网站（登录可见）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--bg)] text-[var(--fg)]`}>
        <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--bg),transparent_60%)] border-b border-[color-mix(in_oklab,var(--fg),transparent_92%)]">
          <div className="mx-auto w-full max-w-[900px] px-6 py-3 flex items-center justify-between">
            <Link href="/" className="text-[15px] font-semibold tracking-tight">我的日常</Link>
            <Navigation />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[900px] px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
