import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreSync — AI-Native Enterprise Work Management",
  description:
    "Enterprise work management, issue tracking, and autonomous AI governance for modern software teams.",
  icons: {
    icon: "/coresync-mark.png",
    shortcut: "/coresync-mark.png",
    apple: "/coresync-mark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#080808] text-white antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
