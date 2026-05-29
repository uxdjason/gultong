import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — 라우트 보호 (§7.1 인증 정책)
 *
 * 보호 경로: /workspace/**
 * 비로그인 시: /login 으로 리다이렉트
 *
 * 개발/테스트 환경 bypass:
 *   - NODE_ENV=development 이거나
 *   - NEXT_PUBLIC_BYPASS_AUTH=true 환경변수 설정 시
 *   인증 검사를 건너뜀.
 *
 * Stage 0에서는 실제 세션 토큰 검사 미구현.
 * NextAuth 설치 후 아래 TODO 섹션을 실 구현으로 교체.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /workspace/** 경로만 보호
  if (!pathname.startsWith('/workspace')) {
    return NextResponse.next();
  }

  // 개발 환경 bypass
  const isDev = process.env.NODE_ENV === 'development';
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

  if (isDev || bypassAuth) {
    return NextResponse.next();
  }

  // TODO (Stage 0 인프라 — NextAuth 설치 후 교체):
  // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  // if (!token) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Stage 0: 임시로 통과 (실제 인증은 NextAuth 설치 후 활성화)
  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*'],
};
