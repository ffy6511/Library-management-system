'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import { BorrowRequest } from '@/types';

interface BorrowFormProps {
  onBorrow: (data: BorrowRequest) => Promise<void>;
}

export default function BorrowForm({ onBorrow }: BorrowFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: BorrowRequest) => {
    try {
      setLoading(true);
      await onBorrow(values);
      message.success('借书成功');
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '借书失败');
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
      <Form.Item
        label="借书证号"
        name="cardId"
        rules={[{ required: true, message: '请输入借书证号' }]}
      >
        <Input placeholder="请输入借书证号" />
      </Form.Item>

      <Form.Item
        label="图书编号"
        name="bookId"
        rules={[{ required: true, message: '请输入图书编号' }]}
      >
        <Input placeholder="请输入图书编号" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认借书
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}