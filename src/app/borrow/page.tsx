'use client';

import { useState } from 'react';
import { Card, message } from 'antd';
import BorrowForm from '@/components/borrow/BorrowForm';
import { BorrowRequest } from '@/types';

export default function BorrowPage() {
  const handleBorrow = async (data: BorrowRequest) => {
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '借书失败');
      }

      await response.json();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-6">
      <Card title="借书" className="max-w-lg mx-auto">
        <BorrowForm onBorrow={handleBorrow} />
      </Card>
    </div>
  );
}