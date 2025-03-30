import React, { useState } from 'react';
import { Button, Upload, message, Form, Input, InputNumber, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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
      setSubmitMessage(`成功导入${data.importedCount}本图书`);
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
        const headers = lines[0].split(',');
        const books = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {} as any);
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
          <Upload
            accept=".csv"
            beforeUpload={beforeUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>选择CSV文件</Button>
          </Upload>
          <div style={{ marginTop: 16 }}>
            <p>CSV文件格式要求:</p>
            <p>第一行应为标题行: id,category,title,publisher,publishYear,author,price</p>
            <p>每行对应一本图书的信息</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBookForm;