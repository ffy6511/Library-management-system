'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOutlined, SwapOutlined, IdcardOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styles from './page.module.css';
import Card from '@/components/ui/Card';
import BorrowForm from '@/components/borrow/BorrowForm';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

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

  const handleBorrow = async (data: any) => {
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '借书失败');
      }

      await response.json();
    } catch (error) {
      throw error;
    }
  };

  const showModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const renderMainContent = () => {
    return (
      <div className={styles.grid}>
        <Card
          title="图书管理"
          description="管理图书信息，包括入库、查询等操作"
          onClick={() => showModal("图书管理", <div>图书管理组件</div>)}
          icon={<BookOutlined />}
        />
        <Card
          title="借还书管理"
          description="处理图书借阅和归还，查看借阅记录"
          onClick={() => showModal("借还书管理", <BorrowForm onBorrow={handleBorrow} />)}
          icon={<SwapOutlined />}
        />
        <Card
          title="借书证管理"
          description="管理借书证的增加、删除和信息修改"
          onClick={() => showModal("借书证管理", <div>借书证管理组件</div>)}
          icon={<IdcardOutlined />}
        />
      </div>
    );
  };

  return (
    <ThemeProvider>
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarInner}>
            <div className={styles.flexCenter}>
              <h1 className={styles.navbarTitle} style={{ cursor: 'pointer' }}>图书管理系统</h1>
            </div>
            <div className={styles.flexCenter}>
              <span className={styles.welcomeText}>欢迎, {session.user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {renderMainContent()}
        <Modal
          title={modalTitle}
          open={modalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {modalContent}
        </Modal>
      </main>
    </div>
    </ThemeProvider>
  );
}
