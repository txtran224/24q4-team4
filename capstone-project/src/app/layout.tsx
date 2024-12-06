// /src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import  ClientWrapper  from "./components/ClientWrapper/ClientWrapper"; // Adjust the path as needed

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Kanban App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} bg-gray-50`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}