import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { config } from "@/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: `Happy Birthday ${config.recipient.name}!`,
  description: config.messages.personalMessage,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
        style={{
          "--primary": config.theme.colors.primary,
          "--secondary": config.theme.colors.secondary,
          "--accent": config.theme.colors.accent,
          "--gold": config.theme.colors.gold,
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
