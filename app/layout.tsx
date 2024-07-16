import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const share = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"]});

export const metadata: Metadata = {
  title: "EVO",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={share.className} style={{backgroundColor: '#FFFFFF90'}}>
        {children}
        </body>
    </html>
  );
}
