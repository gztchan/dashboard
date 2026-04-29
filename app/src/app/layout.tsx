import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppContextProvider } from "@/providers/context";
import { Dashboard } from "@/components/dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  title: "Providence Dashboard",
  description: "浏览器 Job 状态与 user-data 卷管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="root flex min-h-full flex-1 flex-col">
          <TooltipProvider>
            <AppContextProvider>
              <Dashboard>{children}</Dashboard>
            </AppContextProvider>
          </TooltipProvider>
        </div>
      </body>
    </html>
  );
}
