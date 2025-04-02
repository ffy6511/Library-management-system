'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Modal } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface CategoryData {
  category: string;
  total: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: string;
  price: number;
  stock: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value}`;
        },
      },
    },
    datalabels: {
      anchor: 'end' as const,
      align: 'top' as const,
      formatter: (value: number) => value,
      color: '#666',
      font: {
        weight: 'bold' as const
      }
    },
    title: {
      display: true,
      font: {
        size: 16
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '总数量'
      }
    },
    x: {
      title: {
        display: true,
        text: '图书类别'
      }
    },
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  onHover: (event: any, elements: any[]) => {
    const target = event.native?.target;
    if (target) {
      target.style.cursor = elements.length ? 'pointer' : 'default';
    }
  }
};

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleBarClick = async (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const dataIndex = elements[0].index;
      const category = data[dataIndex].category;
      setSelectedCategory(category);

      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'category',
            data: {
              filters: { category },
              pagination: { page: 1, pageSize: 50 },
              sort: { by: 'title', order: 'asc' }
            }
          })
        });

        const result = await response.json();
        if (result.data) {
          setSelectedBooks(result.data);
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
  };

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: '图书总数',
        data: data.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
      },
    ],
  };

  return (
    <div style={{ height: '400px', width: '100%', padding: '20px' }}>
      <Bar 
        data={chartData} 
        options={{
          ...chartOptions,
          onClick: handleBarClick
        }} 
      />
      <Modal
        title={`${selectedCategory} 类别的图书列表`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650}} aria-label="books table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>书名</TableCell>
                <TableCell>作者</TableCell>
                <TableCell>出版社</TableCell>
                <TableCell>出版年份</TableCell>
                <TableCell>价格</TableCell>
                <TableCell>库存数量</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedBooks.map((book) => (
                <TableRow key={book.id} >
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.publishYear}</TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell>{book.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </div>
  );
};

export default CategoryChart;