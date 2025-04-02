'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { PieChartTwoTone, FireTwoTone } from '@ant-design/icons';


// 定义毛玻璃效果的卡片组件
const GlassCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(52, 51, 51, 0.7)'
    : 'rgba(235, 243, 247, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 10px 0 rgba(0, 0, 0, 0.37)'
    : '0 4px 10px 0 rgba(31, 38, 135, 0.37)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.18)'
    : '1px solid rgba(255, 255, 255, 0.7)',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

interface BookRecord {
  id: string;
  title: string;
  author: string;
  borrowCount: number;
}

interface RecordsData {
  todayBorrows: number;
  totalBorrows: number;
  todayReturns: number;
  totalReturns: number;
  mostBorrowedBooks: BookRecord[];
}

export default function Records() {
  const theme = useTheme();
  const [data, setData] = React.useState<RecordsData | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/records');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('获取借阅记录失败:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <Box>加载中...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 500, maxHeight:100, margin: '0 auto', padding: 0 }}>
      {/* 借阅统计卡片 */}
      <GlassCard sx = {{ maxHeight:'120px'}}>
        <CardContent>
          <Typography variant="body1" component="div" gutterBottom
            sx={{ color: theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827', textAlign:'center', fontWeight:'600'}}>
            <PieChartTwoTone /> 借阅统计
          </Typography>
          <Box sx={{ display: 'flex', marginLeft:'3rem', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ mb: 1,  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                今日借阅: {data.todayBorrows} 本
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                历史借阅: {data.totalBorrows} 本
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ mb: 1.5, marginRight:'5rem',color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                今日还书: {data.todayReturns} 本
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                历史还书: {data.totalReturns} 本
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </GlassCard>

      {/* 热门图书卡片 */}
      <GlassCard>
        <CardContent>
          <Typography variant="body1" component="div" gutterBottom
            sx={{ color: theme.palette.mode === 'dark' ? '#f3f4f6' : '#111827', textAlign:'center', fontWeight:'600' }}>
           <FireTwoTone /> 热门图书
          </Typography>
          <Box sx={{ height:200, width: '100%' }}>
            <DataGrid
              rows={data.mostBorrowedBooks}
              columns={[
                { field: 'id', headerName: 'ID', width: 100 },
                { field: 'title', headerName: '书名', width: 200 },
                { field: 'author', headerName: '作者', width: 150 },
                { field: 'borrowCount', headerName: '借阅次数', width: 100 }
              ]}
              hideFooter={true}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }
                }
              }}
              sx={{ border: 0}}
            />
          </Box>
        </CardContent>
      </GlassCard>
    </Box>
  );
}