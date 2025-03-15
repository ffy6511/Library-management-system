import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { books } = await request.json();

    // 使用事务确保批量入库的原子性
    const result = await prisma.$transaction(
      books.map((book: any) =>
        prisma.book.create({
          data: {
            id: book.id,
            category: book.category,
            title: book.title,
            publisher: book.publisher,
            publishYear: book.publishYear,
            author: book.author,
            price: book.price,
            totalCount: book.count,
            availableCount: book.count,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: result.length,
      books: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "批量入库失败", details: (error as Error).message },
      { status: 500 }
    );
  }
}