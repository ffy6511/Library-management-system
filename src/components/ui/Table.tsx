'use client';

import { Table as AntTable } from 'antd';
import type { TableProps } from 'antd';
import styles from './Table.module.css';

export type { TableProps } from 'antd';

export default function Table<T extends object>(props: TableProps<T>) {
  return (
    <AntTable
      {...props}
      className={`${styles.table} ${props.className || ''}`}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total:number) => `共 ${total} 条`,
        ...props.pagination,
      }}
      ></AntTable>
  )
}