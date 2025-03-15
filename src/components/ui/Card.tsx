'use client';

import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: ReactNode;
}

export default function Card({ title, description, onClick, icon }: CardProps) {
  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className={styles.cardContent}>
        {icon && <div className={styles.cardIcon}>{icon}</div>}
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}