'use client';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import Layout from "@/components/ui/Layout";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';

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
          <Layout>
            <div style={{ position: 'fixed', top: '2rem', right: '5rem', zIndex: 1000 }}>
              <ThemeToggle />
            </div>
            {children}
          </Layout>
        </SessionProvider>
      </ThemeProvider>
      </body>

    </html>
  );
}
