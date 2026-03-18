import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";

import { ThemeProvider } from "@/components/ThemeToggle/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Growth Equity",
  description: "MUSEDATA is a growth equity firm deploying minority capital into enterprise software and AI companies, selected through proprietary diligence, and partnered with founders who are building something permanent.",
  icons: {
    icon: "/favicon.ico",
    
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
            <UnifiedNavbar />
            {children}
    </> 
  );
}
