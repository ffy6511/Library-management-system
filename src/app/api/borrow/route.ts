import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未登录或登录已过期" },
        { status: 401 }
      );
    }

    const { cardId, bookId } = await request.json();

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

    if (book.availableCount <= 0) {
      return NextResponse.json(
        { error: "图书已无可借库存" },
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
          adminId: session.user.id,
          borrowDate,
          dueDate,
          status: "borrowed"
        }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: {
          availableCount: {
            decrement: 1
          }
        }
      })
    ]);

    return NextResponse.json(borrowRecord);
  } catch (error) {
    console.error("借书失败:", error);
    return NextResponse.json(
      { error: "借书失败" },
      { status: 500 }
    );
  }
}