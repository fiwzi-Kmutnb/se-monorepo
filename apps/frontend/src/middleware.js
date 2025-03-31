import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/panel/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  if(pathname.includes("panel") && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (pathname.includes("auth") && token) {
    return NextResponse.redirect(new URL('/panel/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/', '/auth/:path*', '/panel/:path*'],
  };
  