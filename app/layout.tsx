import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import LayoutContent from "../components/LayoutContent";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dawnmark.netlify.app"),
  title: "DawnMark - Markdown Editor",
  description:
    "A modern, professional Markdown editor with live preview, file uploads, LaTeX math support, and theme switching. Built with Next.js.",
  keywords: ["markdown", "editor", "live preview", "latex", "math", "file upload", "dark mode"],
  authors: [{ name: "Sourish Ghosh", url: "https://github.com/7sg56" }],
  creator: "Sourish Ghosh",
  publisher: "Sourish Ghosh",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/dawnmark-logo.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    shortcut: "/favicon.svg",
    apple: "/dawnmark-logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "DawnMark - Professional Markdown Editor",
    description: "Modern Markdown editor with live preview, file uploads, and LaTeX support",
    url: "https://dawnmark.netlify.app",
    siteName: "DawnMark",
    images: [
      {
        url: "/assets/dawnmark-screenshot.png",
        width: 1200,
        height: 630,
        alt: "DawnMark Markdown Editor Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DawnMark - Professional Markdown Editor",
    description: "Modern Markdown editor with live preview, file uploads, and LaTeX support",
    images: ["/assets/dawnmark-screenshot.png"],
    creator: "@7sg56",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
