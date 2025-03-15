'use client';

import { Spin } from 'antd';
import styles from './Loading.module.css';

interface LoadingProps {
  tip?: string;
  fullScreen?: boolean;
}

export default function Loading({ tip = '加载中...', fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <Spin tip={tip} size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Spin tip={tip} />
    </div>
  );
}