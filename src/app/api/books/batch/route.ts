import { NextRequest, NextResponse } from "next/server";
import { importBook } from "@/lib/book-utils";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    if (action !== 'batch-import') {
      return NextResponse.json({ error: "无效的操作类型" }, { status: 400 });
    }

    const { books } = data;
    const results = await Promise.all(books.map(book => importBook(book)));

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return NextResponse.json(
      { error: "批量入库失败", details: (error as Error).message },
      { status: 500 }
    );
  }
}