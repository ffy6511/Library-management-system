'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookOutlined, SwapOutlined, IdcardOutlined } from '@ant-design/icons';
import AddBookForm from '@/components/addBook/addBookForm';
import CheckBookForm from '@/components/checkBook/checkBookForm';
import { Modal } from 'antd';
import styles from './page.module.css';
import MyCard from '@/components/ui/Card';
import Card from '@mui/material/Card';
import CardForm from '@/components/card/cardForm';
import ReturnBookForm from '@/components/return/ReturnBookForm';
import { Box } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Records from '@/components/ui/Records';

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
        <div className={styles.topContainer}>
          <img 
            src="/img/library-banner.jpg" 
            alt="图书馆管理系统" 
            className={styles.headerImage}
          />
          <Records />
        </div>
        
        <div className={styles.grid}>
          <Card sx={{ maxWidth: 280 }} className={styles.card} onClick={() => showModal("图书管理", <AddBookForm />)}>
            <CardMedia
              sx={{ height: 120, borderRadius: '5px' }}
              image="/img/book.jpg"
              title="book management"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" sx = {{fontWeight:'500'}} component="div">
                图书管理
              </Typography>
              <Typography variant="body2" sx = {{opacity:'60%'}}>
                管理图书信息，包括入库、查询等操作
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => showModal("图书管理", <AddBookForm />)}>
                <BookOutlined /> 管理图书
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 280 }} className={styles.card} onClick={() => showModal("还书管理", <ReturnBookForm />)}>
            <CardMedia
              sx={{ height: 120, borderRadius: '5px' }}
              image="/img/book2.jpg"
              title="return book"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" sx = {{fontWeight:'500'}} component="div">
                还书管理
              </Typography>
              <Typography variant="body2" sx = {{opacity:'60%'}}>
                处理图书借阅和归还，查看借阅记录
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => showModal("还书管理", <ReturnBookForm />)}>
                <SwapOutlined /> 还书管理
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 280 }} className={styles.card} onClick={() => showModal("借书证管理", <CardForm />)}>
            <CardMedia
                        sx={{ height: 120, borderRadius: '5px' }}
              image="/img/card.jpg"
              title="card management"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" sx = {{fontWeight:'500'}} component="div">
                借书证管理
              </Typography>
              <Typography variant="body2" sx = {{opacity:'60%'}}>
                管理借书证的增加、删除和信息修改
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => showModal("借书证管理", <CardForm />)}>
                <IdcardOutlined /> 借书证管理
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 280 }} className={styles.card} onClick={() => showModal("图书查询", <CheckBookForm />)}>
            <CardMedia
                        sx={{ height: 120, borderRadius: '5px' }}
              image="/img/check.jpg"
              title="book query"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" sx = {{fontWeight:'500'}} component="div">
                图书查询
              </Typography>
              <Typography variant="body2" sx = {{opacity:'60%'}}>
                查询图书信息，包括库存、价格等
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => showModal("图书查询", <CheckBookForm />)}>
                <BookOutlined /> 查询图书
              </Button>
            </CardActions>
          </Card>
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