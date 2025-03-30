'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message } from 'antd';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { id: string; password: string }) => {
    try {
      setError('');
      setLoading(true);

      const response = await signIn('credentials', {
        id: values.id,
        password: values.password,
        redirect: false
      });

      setLoading(false);

      if (response?.error) {
        setError('用户名或密码错误');
        message.error('用户名或密码错误');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      message.error('登录失败');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ width: 400, padding: 24, background: '#fff', borderRadius: 8 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>图书管理系统登录</h2>
        
        <Form
          form={form}
          name="login"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="管理员ID"
            name="id"
            rules={[{ required: true, message: '请输入管理员ID' }]}
          >
            <Input placeholder="请输入管理员ID" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          {error && (
            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <div style={{ color: '#ff4d4f', textAlign: 'center' }}>{error}</div>
            </Form.Item>
          )}

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}