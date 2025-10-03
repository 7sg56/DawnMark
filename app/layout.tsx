import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark-dimmed.css";
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
  title: "DawnMark — Markdown + Blob Attachments",
  description:
    "Minimal live Markdown editor with on-page file uploads using Blob URLs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="app-header">
          <div className="brand" title="DawnMark">
            <div className="logo" aria-hidden="true">
              <div className="logo-square">
                <span className="logo-m">M</span>
              </div>
            </div>
            <span className="name">DawnMark</span>
          </div>
          <a
            className="author"
            href="https://github.com/7sg56"
            target="_blank"
            rel="noopener noreferrer"
          >
            7sg56
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
