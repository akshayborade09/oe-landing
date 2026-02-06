import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextTamaguiProvider } from "@/components/NextTamaguiProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gentona = localFont({
  variable: "--font-gentona",
  src: [
    { path: "../fonts/gentona/Gentona-Thin.otf", weight: "100", style: "normal" },
    { path: "../fonts/gentona/Gentona-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "../fonts/gentona/Gentona-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../fonts/gentona/Gentona-ExtraLightItalic.otf", weight: "200", style: "italic" },
    { path: "../fonts/gentona/Gentona-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/gentona/Gentona-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../fonts/gentona/Gentona-Book.otf", weight: "400", style: "normal" },
    { path: "../fonts/gentona/Gentona-BookItalic.otf", weight: "400", style: "italic" },
    { path: "../fonts/gentona/Gentona-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/gentona/Gentona-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../fonts/gentona/Gentona-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../fonts/gentona/Gentona-SemiBoldItalic.otf", weight: "600", style: "italic" },
    { path: "../fonts/gentona/Gentona-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/gentona/Gentona-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../fonts/gentona/Gentona-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../fonts/gentona/Gentona-ExtraBoldItalic.otf", weight: "800", style: "italic" },
    { path: "../fonts/gentona/Gentona-Heavy.otf", weight: "900", style: "normal" },
    { path: "../fonts/gentona/Gentona-HeavyItalic.otf", weight: "900", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Ola Electric — Switch to Electric. Save Every Ride.",
  description:
    "Minimal maintenance. More distance per rupee. Service designed for convenience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gentona.variable} antialiased`}
      >
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  );
}
