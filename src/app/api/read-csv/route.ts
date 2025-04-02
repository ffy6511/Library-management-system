import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'upcoming.csv');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json({ data: fileContents });
  } catch (error) {
    return NextResponse.json(
      { error: '文件读取失败' },
      { status: 404 }
    );
  }
}