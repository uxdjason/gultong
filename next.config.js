/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Cloudflare Pages 정적 배포를 위한 설정
  images: {
    unoptimized: true, // 정적 배포 시 이미지 최적화 비활성화 필수
  },
}

module.exports = nextConfig
