'use client';

import { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './Navbar.module.css';

interface NavbarProps {
  children?: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.title}>图书管理系统</span>
          </div>
          <div className={styles.nav}>
            <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ backgroundColor: 'transparent'  }}>
              <Menu.Item key="1">
                <Link href="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link href="/about">News</Link>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}