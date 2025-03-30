'use client';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
      <ThemeProvider>
        <SessionProvider>
            <div style={{ position: 'fixed', top: '2rem', right: '10rem', zIndex: 1000 }}>
              <ThemeToggle />
            </div>
            {children}
        </SessionProvider>
      </ThemeProvider>
      </body>

    </html>
  );
}
