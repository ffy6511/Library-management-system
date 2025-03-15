'use client';

import { ReactNode } from 'react';
import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <Navbar />
      </Header>
      <Content className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </Content>
    </AntLayout>
  );
}