import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rangkul (Project Z-Safe) - Platform Anonim untuk Kesehatan Mental & Ekonomi",
  description: "Platform anonim terintegrasi dengan moderasi AI untuk kesehatan mental dan agregator peluang ekonomi bagi yang membutuhkan.",
  keywords: ["mental health", "anti-bullying", "anonymous", "job search", "community support", "Indonesia"],
  authors: [{ name: "Project Z-Safe" }],
  openGraph: {
    title: "Rangkul - Ruang Aman untuk Tumbuh, Bercerita, dan Berdaya",
    description: "Platform anonim terintegrasi dengan moderasi AI untuk kesehatan mental dan agregator peluang ekonomi.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
