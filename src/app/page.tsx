'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>加载中...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarInner}>
            <div className={styles.flexCenter}>
              <h1 className={styles.navbarTitle}>图书管理系统</h1>
            </div>
            <div className={styles.flexCenter}>
              <span className={styles.welcomeText}>欢迎, {session.user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>图书管理</h3>
              <p className={styles.cardDescription}>管理图书信息，包括入库、查询等操作</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>借阅管理</h3>
              <p className={styles.cardDescription}>处理图书借阅和归还业务</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>借书证管理</h3>
              <p className={styles.cardDescription}>管理借书证的增加和删除</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
