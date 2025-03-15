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
            <Menu mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link href="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link href="/books">图书管理</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href="/borrow">借还书</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link href="/cards">借书证</Link>
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <Button
          className={styles.menuButton}
          icon={<MenuOutlined />}
          onClick={() => {}}
        />
      </div>
      {children}
    </div>
  )
}