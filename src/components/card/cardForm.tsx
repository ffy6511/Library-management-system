'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Space, Select } from 'antd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface CardData {
  id: string;
  name: string;
  department: string;
  type: 'student' | 'teacher';
}

export default function CardForm() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [action, setAction] = useState<'create' | 'delete'>('create');
  const [cardInfo, setCardInfo] = useState<CardData | null>(null);

  const handleSubmit = async (values: any) => {
    const key = 'cardOperation';
    try {
      setLoading(true);
      message.loading({ content: action === 'create' ? '正在创建借书证...' : '正在删除借书证...', key });
      
      const response = await fetch('/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          data: action === 'create' ? values : { id: values.id }
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '操作失败');
      }

      message.success({ content: action === 'create' ? '借书证创建成功' : '借书证删除成功', key });
      if (action === 'create') {
        setCardInfo(values as CardData);
      } else {
        setCardInfo(null);
      }
      form.resetFields();
    } catch (error) {
      message.error({
        content: error instanceof Error ? error.message : '操作失败',
        key
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item>
        <Space>
          <Button
            type={action === 'create' ? 'primary' : 'default'}
            onClick={() => setAction('create')}
          >
            创建借书证
          </Button>
          <Button
            type={action === 'delete' ? 'primary' : 'default'}
            onClick={() => setAction('delete')}
          >
            删除借书证
          </Button>
        </Space>
      </Form.Item>

      <Form.Item
        label="借书证ID"
        name="id"
        rules={[{ required: true, message: '请输入借书证ID' }]}
      >
        <Input placeholder="请输入借书证ID" />
      </Form.Item>

      {action === 'create' && (
        <>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="部门/院系"
            name="department"
            rules={[{ required: true, message: '请输入部门/院系' }]}
          >
            <Input placeholder="请输入部门/院系" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value="student">学生</Select.Option>
              <Select.Option value="teacher">教师</Select.Option>
            </Select>
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {action === 'create' ? '创建' : '删除'}
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>

      {cardInfo && (
        <Card sx={{ minWidth: 275, mt: 2 , background: "rgb(237, 228, 222)"}}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
            Library card
            </Typography>
            <Typography sx={{ fontSize: 14, mb: 1 }} color="text.secondary">
              借书证ID：{cardInfo.id}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              姓名：{cardInfo.name}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              部门/院系：{cardInfo.department}
            </Typography>
            <Typography>
              类型：{cardInfo.type === 'student' ? '学生' : '教师'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Form>
  );
}