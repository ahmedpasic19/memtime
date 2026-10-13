import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

import { AppNav } from "@/components/layout/AppNav";

import { Providers } from "./providers";
import "sonner/dist/styles.css";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memtime — Time tracking",
  description: "Client, project, and task hierarchy with time entry management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <AppNav />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
