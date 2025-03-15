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

    // 查找未归还的借阅记录
    const borrowRecord = await prisma.borrowRecord.findFirst({
      where: {
        cardId,
        bookId,
        status: "borrowed"
      }
    });

    if (!borrowRecord) {
      return NextResponse.json(
        { error: "未找到相关的借阅记录" },
        { status: 404 }
      );
    }

    // 更新借阅记录和图书库存
    const returnDate = new Date();
    const [updatedRecord] = await prisma.$transaction([
      prisma.borrowRecord.update({
        where: { id: borrowRecord.id },
        data: {
          returnDate,
          status: "returned"
        }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: {
          availableCount: {
            increment: 1
          }
        }
      })
    ]);

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("还书失败:", error);
    return NextResponse.json(
      { error: "还书失败" },
      { status: 500 }
    );
  }
}