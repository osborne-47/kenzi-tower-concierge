import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenzi Tower Hotel - AI Concierge",
  description: "24/7 Virtual Concierge for Kenzi Tower Hotel Guests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950">
        {children}
      </body>
    </html>
  );
}
