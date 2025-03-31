import React, { useState } from 'react';
import { Button, Upload, message, Form, Input, InputNumber, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type BookFormData = {
  action: string;
  data: {
    id: string;
    category: string;
    title: string;
    publisher: string;
    publishYear: number;
    author: string;
    price: number;
    count: number;
  };
};

type BatchImportData = {
  action: string;
  data: {
    books: Array<Omit<BookFormData['data'], 'count'>>;
    override: boolean;
  };
};

const AddBookForm = () => {
  const [form] = Form.useForm<BookFormData>();
  const [batchMode, setBatchMode] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  const onSubmit = (values: any) => {
    const data = {
      action: 'create',
      data: values
    };
    
    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      setSubmitStatus('success');
      setSubmitMessage('图书添加成功');
      form.resetFields();
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitStatus('error');
      setSubmitMessage('添加失败: ' + (error.message || '请检查表单填写是否正确'));
    });
  };

  const handleBatchSubmit = (data: BatchImportData) => {
    fetch('/api/books/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      const totalCount = data.data.reduce((sum: number, book: any) => sum + (book.total || 1), 0);
      setSubmitStatus('success');
      setSubmitMessage(`成功导入${totalCount}本图书`);
      setRows(data.data.map((book: any) => ({
        ...book,
        price: Number(book.price),
        createdAt: new Date(book.createdAt).toLocaleString(),
        updatedAt: new Date(book.updatedAt).toLocaleString()
      })));
      setShowResults(true);
      setFileList([]);
      form.resetFields();
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitStatus('error');
      setSubmitMessage('批量导入失败: ' + (error.message || '请检查文件格式是否正确'));
    });
  };

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        const books = lines.map(line => {
          const [id, category, title, publisher, publishYear, author, price, count] = line.split(',').map(val => val.trim());
          return {
            id,
            category,
            title,
            publisher,
            publishYear: parseInt(publishYear) || 0,
            author,
            price: parseFloat(price) || 0,
            count: parseInt(count) || 1 // 默认入库数量为1
          };
        });

        handleBatchSubmit({
          action: 'batch-import',
          data: {
            books,
            override: false
          }
        });
      } catch (err) {
        message.error('文件解析失败');
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <div>
      {submitStatus && (
        <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
          <Alert severity={submitStatus}>{submitMessage}</Alert>
        </Stack>
      )}
      <div style={{ marginBottom: 16 }}>
        <Button 
          type={!batchMode ? 'primary' : 'default'} 
          onClick={() => setBatchMode(false)}
        >
          单本入库
        </Button>
        <Button 
          type={batchMode ? 'primary' : 'default'} 
          onClick={() => setBatchMode(true)}
          style={{ marginLeft: 8 }}
        >
          批量导入
        </Button>
      </div>

      {!batchMode ? (
        <Form
          form={form}
          layout="horizontal" // 水平布局
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSubmit}
          style={{ maxWidth: 600 }}
          initialValues={{
            publishYear: 0,
            price: 0,
            count: 1
          }}
        >
          <Form.Item
            label="图书唯一ID"
            name="id"
            rules={[{ required: true, message: '请输入图书唯一ID' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="图书类别"
            name="category"
            rules={[{ required: true, message: '请输入图书类别' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="书名"
            name="title"
            rules={[{ required: true, message: '请输入书名' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="出版社"
            name="publisher"
            rules={[{ required: true, message: '请输入出版社' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="出版年份"
            name="publishYear"
            rules={[{ required: true, message: '请输入出版年份' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            label="作者"
            name="author"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            label="入库数量"
            name="count"
            rules={[{ 
              required: true, 
              message: '请输入入库数量',
              type: 'number',
              min: 1
            }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">提交</Button>
          <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>重置</Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button 
              type={!showResults ? 'primary' : 'default'} 
              onClick={() => setShowResults(false)}
            >
              上传文件
            </Button>
            <Button 
              type={showResults ? 'primary' : 'default'} 
              onClick={() => setShowResults(true)}
              style={{ marginLeft: 8 }}
              disabled={rows.length === 0}
            >
              导入结果
            </Button>
          </div>

          {!showResults ? (
            <div>
              <Upload
                accept=".csv"
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>选择CSV文件</Button>
              </Upload>
              <div style={{ marginTop: "40px" }}>
                <strong>CSV文件格式要求:</strong>
                <p>每行数据格式: id,category,title,publisher,publishYear,author,price,count(缺省为1)</p>
                <p>每行对应一本图书的信息</p>
              </div>
            </div>
          ) : (
            <Paper sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'title', headerName: '书名', width: 130 },
                  { field: 'category', headerName: '类别', width: 130 },
                  { field: 'publisher', headerName: '出版社', width: 130 },
                  { field: 'author', headerName: '作者', width: 130 },
                  { field: 'publishYear', headerName: '出版年份', type: 'number', width: 90 },
                  { field: 'price', headerName: '价格', type: 'number', width: 90 },
                  { field: 'total', headerName: '总数', type: 'number', width: 90 },
                  { field: 'stock', headerName: '库存', type: 'number', width: 90 },
                ]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
                sx={{ border: 0 }}
              />
            </Paper>
          )}
        </div>
      )}
    </div>
  );
};

export default AddBookForm;