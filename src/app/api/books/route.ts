import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const book = await prisma.book.create({
      data: {
        id: data.id,
        category: data.category,
        title: data.title,
        publisher: data.publisher,
        publishYear: data.publishYear,
        author: data.author,
        price: data.price,
        totalCount: data.count,
        availableCount: data.count,
      },
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "图书入库失败" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const title = searchParams.get("title");
    const publisher = searchParams.get("publisher");
    const yearStart = searchParams.get("yearStart");
    const yearEnd = searchParams.get("yearEnd");
    const author = searchParams.get("author");
    const priceStart = searchParams.get("priceStart");
    const priceEnd = searchParams.get("priceEnd");
    const sortBy = searchParams.get("sortBy") || "title";
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50"), 50);

    const where: any = {};
    if (category) where.category = category;
    if (title) where.title = { contains: title };
    if (publisher) where.publisher = { contains: publisher };
    if (author) where.author = { contains: author };
    if (yearStart || yearEnd) {
      where.publishYear = {};
      if (yearStart) where.publishYear.gte = parseInt(yearStart);
      if (yearEnd) where.publishYear.lte = parseInt(yearEnd);
    }
    if (priceStart || priceEnd) {
      where.price = {};
      if (priceStart) where.price.gte = parseFloat(priceStart);
      if (priceEnd) where.price.lte = parseFloat(priceEnd);
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { [sortBy]: order },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const total = await prisma.book.count({ where });

    return NextResponse.json({
      books,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return NextResponse.json({ error: "图书查询失败" }, { status: 500 });
  }
}