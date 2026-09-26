import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Launch Era Cleaning App",
  description: "Simple daily operations for residential cleaning businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
