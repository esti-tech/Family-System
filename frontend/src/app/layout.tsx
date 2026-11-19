import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KinKeep — Digital Family Heritage & Memory Preservation Platform",
  description: "Preserve multi-generational family trees, biographical stories, historical timelines, and precious family memories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory-100 text-charcoal-900 antialiased selection:bg-gold-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
