/**
 * 배포 대상에 따라 설정 분기.
 *
 * - GitHub Pages: GITHUB_PAGES=true 일 때만 정적 export + basePath(/weddinginvitation) 적용
 *   (워크플로 deploy-pages.yml 에서 GITHUB_PAGES=true 주입)
 * - Vercel(기본): export/basePath 미적용 → 루트(/)에서 일반 Next 로 동작
 *
 * @type {import('next').NextConfig}
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        output: "export",
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
