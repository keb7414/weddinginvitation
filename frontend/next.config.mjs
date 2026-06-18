/**
 * GitHub Pages 정적 배포 설정.
 *
 * - output: 'export'  → next build 시 정적 HTML 묶음(out/) 생성
 * - basePath          → 프로젝트 페이지는 /<repo> 하위 경로로 서빙됨
 *                       (https://keb7414.github.io/weddinginvitation)
 *                       커스텀 도메인 사용 시 NEXT_PUBLIC_BASE_PATH 를 빈 값으로.
 * - images.unoptimized → 정적 export 에서는 next/image 최적화 서버가 없어 필수
 *
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
