import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 获取今天的日期（去除时间部分）
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取今日借阅记录数
    const todayBorrows = await prisma.borrowRecord.count({
      where: {
        borrowDate: {
          gte: today
        }
      }
    });

    // 获取历史总借阅记录数
    const totalBorrows = await prisma.borrowRecord.count();

    // 获取今日还书记录数
    const todayReturns = await prisma.borrowRecord.count({
      where: {
        returnDate: {
          gte: today
        },
        status: 'returned'
      }
    });

    // 获取历史总还书记录数
    const totalReturns = await prisma.borrowRecord.count({
      where: {
        status: 'returned'
      }
    });

    // 获取借阅次数最多的图书
    const mostBorrowedBooks = await prisma.book.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        author: true,
        _count: {
          select: { borrowRecords: true }
        }
      },
      orderBy: {
        borrowRecords: {
          _count: 'desc'
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        todayBorrows,
        totalBorrows,
        todayReturns,
        totalReturns,
        mostBorrowedBooks: mostBorrowedBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          borrowCount: book._count.borrowRecords
        }))
      }
    });
  } catch (error) {
    console.error('获取借阅记录统计失败:', error);
    return NextResponse.json(
      { success: false, message: '获取借阅记录统计失败' },
      { status: 500 }
    );
  }
}