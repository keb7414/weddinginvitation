// public/ 정적 자산 경로에 basePath 를 붙여준다.
// 일반 <img src> 는 Next 가 basePath 를 자동으로 안 붙이므로 이 헬퍼로 감싼다.
// (NEXT_PUBLIC_BASE_PATH 는 빌드 시 인라인 — 로컬은 "", GitHub Pages 는 /weddinginvitation)
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE}${path}`;
