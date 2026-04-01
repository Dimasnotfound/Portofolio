import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dimas Juli Pratama | Portfolio",
  description: "Interactive Windows XP style portfolio rebuilt with Next.js.",
  icons: {
    icon: "/icons/xp-windows-logo.png",
    shortcut: "/icons/xp-windows-logo.png",
    apple: "/icons/xp-windows-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
