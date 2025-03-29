import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: "未登录或登录已过期" },
    //     { status: 401 }
    //   );
    // }

    const { action, data } = await request.json();

    if (action === 'create') {
      if (!data.id || !data.name || !data.department || !data.type) {
        return NextResponse.json(
          { error: "缺少必要参数" },
          { status: 400 }
        );
      }

      const card = await prisma.libraryCard.create({
        data: {
          id: data.id,
          name: data.name,
          department: data.department,
          type: data.type
        }
      });

      return NextResponse.json(card);
    } 
    else if (action === 'delete') {
      if (!data.id) {
        return NextResponse.json(
          { error: "缺少图书证ID" },
          { status: 400 }
        );
      }

      // 检查是否有未归还的图书
      const hasUnreturnedBooks = await prisma.borrowRecord.count({
        where: {
          cardId: data.id,
          status: "borrowed"
        }
      });

      if (hasUnreturnedBooks > 0) {
        return NextResponse.json(
          { error: "该图书证有未归还的图书，不能删除" },
          { status: 400 }
        );
      }

      await prisma.libraryCard.delete({
        where: { id: data.id }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "无效的操作类型" },
      { status: 400 }
    );
  } catch (error) {
    console.error("操作失败:", error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}