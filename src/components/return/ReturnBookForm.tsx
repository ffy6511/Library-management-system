'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

interface ReturnRequest {
  cardId: string;
  bookId: string;
}

interface BorrowRecord {
  id: string;
  bookId: string;
  title: string;
  borrowDate: string;
  dueDate: string;
}

export default function ReturnBookForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [rows, setRows] = useState<BorrowRecord[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const columns: GridColDef[] = [
    { field: 'id', headerName: '记录ID', width: 100 },
    { field: 'bookId', headerName: '图书ID', width: 120 },
    { field: 'title', headerName: '书名', width: 200 },
    { field: 'borrowDate', headerName: '借出日期', width: 150 },
    { field: 'dueDate', headerName: '应还日期', width: 150 },
    {
      field: 'action',
      headerName: '操作',
      width: 120,
      renderCell: (params) => (
        <Button 
          size="small" 
          onClick={() => handleReturn(params.row.bookId)}
          disabled={loading}
        >
          归还
        </Button>
      ),
    },
  ];

  const handleQuery = async (values: { cardId: string }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'query',
          data: {
            cardId: values.cardId
          }
        }),
      });

      const data = await response.json();
      const formattedRows = data.map((record: any) => ({
        id: record.id,
        bookId: record.bookId,
        title: record.book?.title || '未知',
        borrowDate: new Date(record.borrowDate).toLocaleDateString(),
        dueDate: new Date(record.dueDate).toLocaleDateString()
      }));
      setRows(formattedRows);
      setShowResults(true);
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId: string) => {
    try {
      setLoading(true);
      const cardId = form.getFieldValue('cardId');
      const response = await fetch('/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'return',
          data: {
            cardId,
            bookId
          }
        }),
      });

      if (!response.ok) {
        throw new Error('还书失败');
      }

      message.success('还书成功');
      // 刷新查询结果
      await handleQuery({ cardId });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '还书失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        type={!showResults ? 'primary' : 'default'} 
        onClick={() => setShowResults(false)}
        style={{ marginBottom: 16 }}
      >
        查询条件
      </Button>
      <Button 
        type={showResults ? 'primary' : 'default'} 
        onClick={() => setShowResults(true)}
        style={{ marginBottom: 16, marginLeft: 8 }}
        disabled={rows.length === 0}
      >
        查询结果
      </Button>

      {!showResults ? (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={handleQuery}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="借书证号"
            name="cardId"
            rules={[{ required: true, message: '请输入借书证号' }]}
          >
            <Input placeholder="请输入借书证号" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询借阅记录
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
          />
        </Paper>
      )}
    </div>
  );
}