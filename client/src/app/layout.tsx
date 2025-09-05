import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stream-Hub | Watch & Upload Videos in Adaptive Streaming",
  description:
    "Stream-Hub is a next-gen video streaming platform where users can upload and watch videos in adaptive bitrate streaming. Enjoy smooth playback in the resolution you want — from HD to 4K.",

  alternates: {
    canonical: "https://video-stream-app-43vc.vercel.app",
  },
  icons: {
    icon: "/logo.ico",        // default favicon
    shortcut: "/logo.ico",    // for old browsers
    // apple: "/logo.png",       // for Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
