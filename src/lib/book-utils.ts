import { prisma } from "@/lib/prisma";

interface BookData {
  id: string;
  category: string;
  title: string;
  publisher: string;
  publishYear: number;
  author: string;
  price: number;
  count: number;
}

export async function importBook(book: BookData) {
  const existingBook = await prisma.book.findUnique({ where: { id: book.id } });
  
  if (existingBook) {
    // 仅增加库存
    return prisma.book.update({
      where: { id: book.id },
      data: {
        total: { increment: book.count },
        stock: { increment: book.count }
      }
    });
  } else {
    // 新书入库
    return prisma.book.create({
      data: {
        id: book.id,
        category: book.category,
        title: book.title,
        publisher: book.publisher,
        publishYear: book.publishYear,
        author: book.author,
        price: book.price,
        total: book.count,
        stock: book.count
      }
    });
  }
}