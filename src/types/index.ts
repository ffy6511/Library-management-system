import { Book, LibraryCard, Admin, BorrowRecord, CardType, LoanStatus } from "@prisma/client";
import { DefaultSession } from "next-auth";

// 扩展 next-auth 的 Session 类型
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      contact: string;
    } & DefaultSession["user"];
  }
};

// 导出 Prisma 生成的类型
export type {
  Book,
  LibraryCard,
  Admin,
  BorrowRecord,
  CardType,
  LoanStatus,
};

// API 响应类型
export interface ApiResponse<T = any> {
  error?: string;
  data?: T;
}

// 借阅请求类型
export interface BorrowRequest {
  cardId: string;
  bookId: string;
}

// 还书请求类型
export interface ReturnRequest {
  cardId: string;
  bookId: string;
}