import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 如果访问根路径，重定向到manage页面
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/manage', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/']
};