'use client';

import { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, message, Radio, Modal } from 'antd';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type Decimal = { toNumber: () => number };

const CheckBookForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'publisher', headerName: 'Publisher', width: 130 },
    { field: 'author', headerName: 'Author', width: 130 },
    { field: 'publishYear', headerName: 'Year', type: 'number', width: 90 },
    { field: 'price', headerName: 'Price', type: 'number', width: 90 },
    { field: 'stock', headerName: 'Stock', type: 'number', width: 90 },
  ];

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'query',
          data: {
            filters: {
              category: values.category,
              title: values.title,
              publisher: values.publisher,
              author: values.author,
              yearStart: values.publishYear?.[0]?.year(),
              yearEnd: values.publishYear?.[1]?.year(),
              priceStart: values.priceStart,
              priceEnd: values.priceEnd
            },
            pagination: {
              page: paginationModel.page + 1,
              pageSize: paginationModel.pageSize,
            },
            sort: {
              by: values.sortBy || 'title',
              order: values.sortOrder || 'asc'
            }
          },
        }),
      });

      const data = await response.json();
      const formattedRows = data.data.map((row: any) => ({
        ...row,
        price: Number(row.price),
        createdAt: new Date(row.createdAt).toLocaleString(),
        updatedAt: new Date(row.updatedAt).toLocaleString()
      }));
      setPaginationModel({
        page: data.pagination.page - 1,
        pageSize: data.pagination.pageSize
      });
      setRows(formattedRows);
      setShowResults(true);
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [borrowCardId, setBorrowCardId] = useState('');
  
  const handleBorrow = async () => {
    if (!borrowCardId) {
      message.error('请输入借书证号');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'borrow',
          data: {
            cardId: borrowCardId,
            bookIds: selectedRows.map(row => row.id)
          }
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        message.success('借书成功');
        setBorrowModalVisible(false);
        setBorrowCardId('');
        // 更新本地数据中被借阅图书的库存
        const updatedRows = rows.map(row => {
          if (selectedRows.find(selected => selected.id === row.id)) {
            return { ...row, stock: row.stock - 1 };
          }
          return row;
        });
        setRows(updatedRows);
        setSelectedRows([]);
      } else {
        message.error(result.error || '借书失败');
      }
    } catch (error) {
      message.error('借书失败');
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
      >
        查询结果
      </Button>

      {selectedRows.length > 0 && (
            <Button
              type="primary"
              onClick={() => setBorrowModalVisible(true)}
              style={{ marginLeft: 16 }}
            >
              借阅选中图书
            </Button>
          )}

      {!showResults ? (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="图书类别" name="category">
            <Input />
          </Form.Item>
          
          <Form.Item label="书名" name="title">
            <Input />
          </Form.Item>
          
          <Form.Item label="出版社" name="publisher">
            <Input />
          </Form.Item>
          
          <Form.Item label="作者" name="author">
            <Input />
          </Form.Item>
          
          <Form.Item label="出版年份" name="publishYear">
            <DatePicker.RangePicker picker="year" />
          </Form.Item>
          
          <Form.Item label="价格区间">
            <Form.Item name="priceStart" style={{ display: 'inline-block', width: '48%', marginRight: '4%', marginBottom: 0 }}>
              <InputNumber placeholder="最低价" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="priceEnd" style={{ display: 'inline-block', width: '48%', marginBottom: 0 }}>
              <InputNumber placeholder="最高价" style={{ width: '100%' }} />
            </Form.Item>
          </Form.Item>
          
          <Form.Item label="排序字段" name="sortBy">
            <Select placeholder="书名">
              <Select.Option value="title">书名</Select.Option>
              <Select.Option value="publishYear">出版年份</Select.Option>
              <Select.Option value="price">价格</Select.Option>
            </Select>
          </Form.Item>
          
          {/* <Form.Item label="排序方式" name="sortOrder">
            <Select placeholder="选择排序方式">
              <Select.Option value="asc">升序</Select.Option>
              <Select.Option value="desc">降序</Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item label="排序方式" name="sortOrder">
          <Radio.Group>
            <Radio value="asc"> 升序 </Radio>
            <Radio value="desc"> 降序 </Radio>
          </Radio.Group>
          </Form.Item>

          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
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
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(rows.filter(row => newSelection.includes(row.id)));
            }}
            sx={{ border: 0 }}
          />

        </Paper>
      )}

      <Modal
        title="借阅图书"
        open={borrowModalVisible}
        onOk={handleBorrow}
        onCancel={() => {
          setBorrowModalVisible(false);
          setBorrowCardId('');
        }}
        confirmLoading={loading}
      >
        <Form.Item label="借书证号" required>
          <Input
            value={borrowCardId}
            onChange={e => setBorrowCardId(e.target.value)}
            placeholder="请输入借书证号"
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default CheckBookForm;