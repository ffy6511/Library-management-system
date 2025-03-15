'use client';

import { Input } from 'antd';
import type { SearchProps as AntSearchProps } from 'antd/es/input';

export type SearchProps = AntSearchProps;

export default function Search(props: SearchProps) {
  return (
    <Input.Search
      {...props}
      className={`w-64 ${props.className || ''}`}
      placeholder={props.placeholder || '请输入关键词搜索'}
    />
  );
}