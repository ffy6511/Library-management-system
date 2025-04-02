import { NextRequest, NextResponse } from "next/server";
import { importBook } from "@/lib/book-utils";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    if (action === 'create') {
      if (!data.id || !data.count || data.count <= 0) {
        return NextResponse.json({ error: "无效的图书信息" }, { status: 400 });
      }

      const book = await importBook(data);
      return NextResponse.json(book);
    }
    else if (action === 'groupby') {
      // 按类别统计图书条目数
      const result = await prisma.book.groupBy({
        by: ['category'],
        _count: true,
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 6
      });

      const categoryStats = result.map(item => ({
        category: item.category || '未分类',
        total: item._count || 0
      }));

      return NextResponse.json({ data: categoryStats });
    }
    else if (action === 'query') {
      // 图书查询逻辑
      const { 
        filters = {}, 
        pagination = { page: 1, pageSize: 50 },
        sort = { by: 'title', order: 'asc' }
      } = data;

      const where = buildWhereClause(filters);
      const { page, pageSize } = pagination;
      const { by, order } = sort;

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          orderBy: { [by]: order },
          take: Math.min(pageSize, 50),
          skip: (page - 1) * pageSize,
        }),
        prisma.book.count({ where })
      ]);

      return NextResponse.json({
        data: books,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    }

    else if(action === 'category'){
      // 图书查询逻辑
      const { 
        filters = {}, 
        pagination = { page: 1, pageSize: 50 },
        sort = { by: 'title', order: 'asc' }
      } = data;

      const where = buildWhereClauseWithCategory(filters);
      const { page, pageSize } = pagination;
      const { by, order } = sort;

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          orderBy: { [by]: order },
          take: Math.min(pageSize, 50),
          skip: (page - 1) * pageSize,
        }),
        prisma.book.count({ where })
      ]);

      return NextResponse.json({
        data: books,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    }

    return NextResponse.json({ error: "无效的操作类型" }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

// 辅助函数：构建查询条件, 利用前端给出的字段随意组合进行条件查询
function buildWhereClause(filters: Record<string, any>) {
  const where: any = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;
    
    switch (key) {
      case 'yearStart':
      case 'yearEnd':
        where.publishYear = where.publishYear || {};
        if (key === 'yearStart') where.publishYear.gte = parseInt(value); // 出版年份大于等于
        if (key === 'yearEnd') where.publishYear.lte = parseInt(value);
        break;
      case 'priceStart':
      case 'priceEnd':
        where.price = where.price || {};
        if (key === 'priceStart') where.price.gte = parseFloat(value);
        if (key === 'priceEnd') where.price.lte = parseFloat(value);
        break;
        
      case 'category':
        // 精确匹配类别
        // where[key] = value;
        // break; 
      case 'title':
      case 'author':
      case 'publisher':
          // 上述字段的模糊搜索
          // 由于存在中文, 所以无法使用IncentiveSearch
          where[key] = { contains: value }; 
          break;  
      default:
        where[key] = { contains: value };
    }
  }
  
  return where;
}

// 精确查找
function buildWhereClauseWithCategory(filters: Record<string, any>) {
  const where: any = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;
    
    switch (key) {
      case 'yearStart':
      case 'yearEnd':
        where.publishYear = where.publishYear || {};
        if (key === 'yearStart') where.publishYear.gte = parseInt(value); // 出版年份大于等于
        if (key === 'yearEnd') where.publishYear.lte = parseInt(value);
        break;
      case 'priceStart':
      case 'priceEnd':
        where.price = where.price || {};
        if (key === 'priceStart') where.price.gte = parseFloat(value);
        if (key === 'priceEnd') where.price.lte = parseFloat(value);
        break;
        
      case 'category':
        // 精确匹配类别
        where[key] = value;
        break; 
      case 'title':
      case 'author':
      case 'publisher':
          // 上述字段的模糊搜索
          // 由于存在中文, 所以无法使用IncentiveSearch
          where[key] = { contains: value }; 
          break;  
      default:
        where[key] = { contains: value };
    }
  }
  
  return where;
}