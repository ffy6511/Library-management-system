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
      const { cardId, bookIds } = data;
      
      if (!cardId || !bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
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

      // 检查所有图书是否存在且有库存
      const books = await prisma.book.findMany({
        where: {
          id: { in: bookIds }
        }
      });

      if (books.length !== bookIds.length) {
        return NextResponse.json(
          { error: "部分图书不存在" },
          { status: 404 }
        );
      }

      const noStockBooks = books.filter(book => book.stock <= 0);
      if (noStockBooks.length > 0) {
        return NextResponse.json(
          { 
            error: "以下图书已无可借库存", 
            books: noStockBooks.map(book => book.title)
          },
          { status: 400 }
        );
      }

      // 检查是否有未还的相同图书
      const existingBorrows = await prisma.borrowRecord.findMany({
        where: {
          cardId,
          bookId: { in: bookIds },
          status: "borrowed"
        }
      });

      if (existingBorrows.length > 0) {
        return NextResponse.json(
          { 
            error: "以下图书已借阅且未归还",
            books: existingBorrows.map(record => record.bookId)
          },
          { status: 400 }
        );
      }

      // 创建借阅记录并更新图书库存
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 设置30天的借阅期限

      const transactions = bookIds.flatMap(bookId => [
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

      const results = await prisma.$transaction(transactions);
      const borrowRecords = results.filter(result => 'status' in result);

      return NextResponse.json(borrowRecords);
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