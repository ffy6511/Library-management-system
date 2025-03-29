import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    if (!action || !data) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }
    
    if (action === 'query') {
      const { cardId } = data;
      if (!cardId) {
        return NextResponse.json(
          { error: "缺少借书证号" },
          { status: 400 }
        );
      }
      
      const records = await prisma.borrowRecord.findMany({
        where: { cardId },
        include: { book: true },
        take: 50,
        orderBy: { borrowDate: 'desc' }
      });
      
      return NextResponse.json(records);

    } else if (action === 'borrow') {
      const { cardId, bookId } = data;
      
      if (!cardId || !bookId) {
        return NextResponse.json(
          { error: "缺少必要参数" },
          { status: 400 }
        );
      }
      
      // 检查图书证是否存在
      const card = await prisma.libraryCard.findUnique({
        where: { id: cardId }
      });

      if (!card) {
        return NextResponse.json(
          { error: "图书证不存在" },
          { status: 404 }
        );
      }

      // 检查图书是否存在且有库存
      const book = await prisma.book.findUnique({
        where: { id: bookId }
      });

      if (!book) {
        return NextResponse.json(
          { error: "图书不存在" },
          { status: 404 }
        );
      }

      if (book.stock <= 0) {
        // 查找最近归还时间
        const lastReturn = await prisma.borrowRecord.findFirst({
          where: { bookId, status: 'returned' },
          orderBy: { returnDate: 'desc' },
          select: { returnDate: true }
        });
        
        return NextResponse.json(
          { 
            error: "图书已无可借库存", 
            lastReturnDate: lastReturn?.returnDate || null 
          },
          { status: 400 }
        );
      }

      // 检查是否有未还的相同图书
      const existingBorrow = await prisma.borrowRecord.findFirst({
        where: {
          cardId,
          bookId,
          status: "borrowed"
        }
      });

      if (existingBorrow) {
        return NextResponse.json(
          { error: "已借阅此书且未归还" },
          { status: 400 }
        );
      }

      // 创建借阅记录并更新图书库存
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 设置30天的借阅期限

      const [borrowRecord] = await prisma.$transaction([
        prisma.borrowRecord.create({
          data: {
            bookId,
            cardId,
            borrowDate,
            dueDate,
            status: "borrowed",
            adminId: "admin" // 临时添加默认管理员ID
          }
        }),
        prisma.book.update({
          where: { id: bookId },
          data: {
            stock: {
              decrement: 1
            }
          }
        })
      ]);

      return NextResponse.json(borrowRecord);
    } else {
      return NextResponse.json(
        { error: "无效的操作类型" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("借书失败:", error);
    return NextResponse.json(
      { error: "借书失败" },
      { status: 500 }
    );
  }
}