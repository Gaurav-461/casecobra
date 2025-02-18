import type { Metadata } from "next";
import { Geist, Geist_Mono, Recursive } from "next/font/google";

import "./globals.css";
import { Navbar, Footer } from "@/components";
import { Toaster } from "sonner";
import Provider from "@/components/Provider";

const recursive = Recursive({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "case cobra",
  description: "Created by Gaurav",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${recursive.className} antialiased`}
      >
        <Navbar />
        <main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
          <div className="flex h-full flex-1 flex-col">
            <Provider>{children}</Provider>
          </div>
          <Footer />
        </main>
        <Toaster richColors position="bottom-right"/>
      </body>
    </html>
  );
}
