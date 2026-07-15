"use client";

import { useEffect } from "react";
import { wedding } from "@/lib/data";

/**
 * 예식장 위치 리다이렉트 페이지.
 * 카카오 공유 카드의 '위치보기' 버튼용 — Kakao Share 버튼 링크는 등록된 우리 도메인이어야
 * 하므로, 이 페이지(우리 도메인)를 거쳐 카카오맵으로 넘긴다.
 */
export default function MapRedirect() {
  useEffect(() => {
    const q = encodeURIComponent(wedding.venue.address);
    window.location.replace(`https://m.map.kakao.com/actions/searchView?q=${q}`);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory text-sm text-muted">
      지도로 이동 중…
    </main>
  );
}
