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
            
            {/* 固定底部页脚 */}
            <footer style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              textAlign: 'center',
              backgroundColor: 'var(--footer-bg)',
              color: 'var(--footer-text)',
              zIndex: 999
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <a href="https://mybook-liart-omega.vercel.app/" target = '_blank' style={{ color: 'inherit' }}>关于我们</a>
                <a href="https://mybook-liart-omega.vercel.app/about/"  target = '_blank' style={{ color: 'inherit' }}>联系我们</a>
                <a href="https://policies.google.com/privacy" target="_blank" style={{ color: 'inherit' }}>隐私政策</a>
                <a href="https://policies.google.com/terms" target = '_blank' style={{ color: 'inherit' }}>使用条款</a>
              </div>
              {/* <p style={{ marginTop: '0.5rem' }}>© {new Date().getFullYear()} 图书馆管理系统</p> */}
            </footer>
          </Layout>
        </SessionProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
