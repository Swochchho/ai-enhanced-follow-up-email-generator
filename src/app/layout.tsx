import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting Notes Assistant",
  description: "Meeting notes in. Action items out. Paste your notes, get a summary, action items, and a follow-up email draft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body bg-paper text-ink min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
