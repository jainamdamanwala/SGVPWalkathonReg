import type { Metadata } from "next";
import "./globals.css";
import { EVENT } from "@/lib/config";

export const metadata: Metadata = {
  title: `${EVENT.name} Registration`,
  description: "Register, pay online, and receive a QR code confirmation by email.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
