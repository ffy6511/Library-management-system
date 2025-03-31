'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOutlined, SwapOutlined, IdcardOutlined } from '@ant-design/icons';
import AddBookForm from '@/components/addBook/addBookForm';
import CheckBookForm from '@/components/checkBook/checkBookForm';
import { Modal } from 'antd';
import styles from './page.module.css';
import Card from '@/components/ui/Card';
import BorrowForm from '@/components/borrow/BorrowForm';
import CardForm from '@/components/card/cardForm';
import ReturnBookForm from '@/components/return/ReturnBookForm';
import { Box } from '@mui/material';

export default function Manage() {
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
      <Box sx={{ p: 3 }}>
        <div className={styles.grid}>
          <Card
            title="图书管理"
            description="管理图书信息，包括入库、查询等操作"
            onClick={() => showModal("图书管理", <AddBookForm />)}
            icon={<BookOutlined />}
          />
          <Card
            title="还书管理"
            description="处理图书借阅和归还，查看借阅记录"
            onClick={() => showModal("还书管理", <ReturnBookForm/>)}
            icon={<SwapOutlined />}
          />
          <Card
            title="借书证管理"
            description="管理借书证的增加、删除和信息修改"
            onClick={() => showModal("借书证管理", <CardForm />)}
            icon={<IdcardOutlined />}
          />
          <Card
            title="图书查询"
            description="查询图书信息，包括库存、价格等"
            onClick={() => showModal("图书查询", <CheckBookForm />)}
            icon={<BookOutlined />}
          />
        </div>
        <Modal
          title={modalTitle}
          open={modalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          {modalContent}
        </Modal>
      </Box>
    );
  };

  return renderMainContent();
}