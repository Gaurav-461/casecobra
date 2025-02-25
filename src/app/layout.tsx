import { Geist, Geist_Mono, Recursive } from "next/font/google";

import "./globals.css";
import { Navbar, Footer } from "@/components";
import { Toaster } from "sonner";
import QueryProvider from "@/components/QueryProvider";
import { constructMetadata } from "@/lib/utils";

const recursive = Recursive({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = constructMetadata(); 

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
        {/* <ThemeProvider attribute="class"> */}
        <Navbar />
        <main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
          <div className="flex h-full flex-1 flex-col">
            <QueryProvider>{children}</QueryProvider>
          </div>
          <Footer />
        </main>
        <Toaster richColors position="bottom-right" />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
