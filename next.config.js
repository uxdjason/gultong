/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Cloudflare Pages에서 Next.js API 라우터(SSR/Edge)를 사용하기 위해 주석 처리합니다.
  images: {
    unoptimized: true, // 정적 배포 시 이미지 최적화 비활성화 필수
  },
}

module.exports = nextConfig
