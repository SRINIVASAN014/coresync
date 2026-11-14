import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreSync — AI-Native Multi-Company Work Management",
  description:
    "Next-generation Jira alternative with autonomous AI agents and strict multi-tenant governance.",
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
