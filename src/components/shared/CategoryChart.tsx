'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface CategoryData {
  category: string;
  total: number;
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
};

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
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
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CategoryChart;