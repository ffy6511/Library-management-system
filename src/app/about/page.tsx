'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Papa from 'papaparse';
import CategoryChart from '@/components/shared/CategoryChart';
import { ClockCircleOutlined, BarChartOutlined } from '@ant-design/icons';

interface Book {
  id: string;
  title: string;
  category: string;
  publisher: string;
  author: string;
  publishYear: number;
  price: number;
  total: number;
  stock: number;
}

const defaultBooks: Book[] = [
  {
    id: '1',
    title: '示例图书1',
    category: '计算机',
    publisher: '示例出版社',
    author: '作者1',
    publishYear: 2023,
    price: 59.9,
    total: 10,
    stock: 8
  },
  // 可以添加更多默认数据...
];

export default function About() {
  const [rows, setRows] = useState<Book[]>(defaultBooks);
  const [categoryStats, setCategoryStats] = useState<{ category: string; total: number; }[]>([]);
  const [upcomingBooks, setUpcomingBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 加载图书类别统计数据
      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'groupby'
          })
        });
        if (response.ok) {
          const result = await response.json();
          setCategoryStats(result.data);
        }
      } catch (error) {
        console.error('获取类别统计失败:', error);
      }

      // 加载近期上线数据
      try {
        const response = await fetch('/api/read-csv');
        if (!response.ok) throw new Error('获取数据失败');
        
        const { data } = await response.json();
        const csvString = data.replace(/\\n/g, '\n');
        
        Papa.parse(csvString, {
          header: false,
          complete: (results) => {
            const parsedData = results.data.map((item: any, index) => ({
              id: `upcoming_${index + 1}`,
              title: item[1] || '未知书名',
              category: item[2] || '未分类',
              publisher: item[3] || '未知出版社',
              author: item[4] || '未知作者',
              publishYear: parseInt(item[5]) || 2023,
              price: parseFloat(item[6]) || 0,
              total: parseInt(item[7]) || 0,
              stock: parseInt(item[8]) || 0
            }));
            setUpcomingBooks(parsedData);
          }
        });
      } catch (error) {
        console.error('获取近期上线数据失败:', error);
        setUpcomingBooks([]);
      }

      // 加载CSV数据
      try {
        const response = await fetch('/api/read-csv');
        if (!response.ok) throw new Error('获取数据失败');
        
        const { data } = await response.json();
        const csvString = data.replace(/\\n/g, '\n');
        
        Papa.parse(csvString, {
          header: false,
          complete: (results) => {
            const parsedData = results.data.map((item: any, index) => ({
              id: (index + 1).toString(),
              title: item[1] || '未知书名',
              category: item[2] || '未分类',
              publisher: item[3] || '未知出版社',
              author: item[4] || '未知作者',
              publishYear: parseInt(item[5]) || 2023,
              price: parseFloat(item[6]) || 0,
              total: parseInt(item[7]) || 0,
              stock: parseInt(item[8]) || 0
            }));
            setRows(parsedData);
          }
        });
      } catch (error) {
        console.log('使用默认数据:', error);
        setRows(defaultBooks);
      }
    };

    loadData();
  }, []);

  return (
    <div style = {{color: 'var(--default-text-color'}} >
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx = {{fontWeight:'600' , textAlign:'center', marginBottom:'3rem'}}>
        图书统计
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'nowrap' }}>
        <Paper sx={{ flex: '1 1 300px', height: 500, padding: '20px', borderRadius: '10px' }}>
          <Typography variant="h5" gutterBottom sx = {{fontWeight:'550', textAlign:'center' }}> <BarChartOutlined /> 图书分类统计</Typography>
          <CategoryChart data={categoryStats} />
        </Paper>
        <Paper sx={{ flex: '1 1 500px', height: 500, padding: '20px', borderRadius: '10px', width:'50%' }}>
          <Typography variant="h5" gutterBottom sx = {{fontWeight:'550', textAlign:'center' }}> <ClockCircleOutlined /> 计划上线</Typography>
          <DataGrid
            rows={upcomingBooks}
            columns={[
              { field: 'title', headerName: '书名', width: 130 },
              { field: 'category', headerName: '类别', width: 130 },
              { field: 'publisher', headerName: '出版社', width: 130 },
              { field: 'author', headerName: '作者', width: 90 },
              { field: 'publishYear', headerName: '出版年份', type: 'number', width: 90 },
              { field: 'price', headerName: '价格', type: 'number', width: 90 },
            ]}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
      </Box>
    </div>
  );
}