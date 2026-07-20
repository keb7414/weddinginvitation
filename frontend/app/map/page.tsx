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
    // 카카오맵 지도 상세뷰(detailMapView)로 이동 → 지도 + 핀 + 길찾기 버튼.
    // link/map 형식: {표시명},{위도},{경도} — 표시명을 '주소'로 넣어 주소 기준 조회.
    // (searchView 는 '검색' 화면이라 지도가 안 뜸)
    const { address, lat, lng } = wedding.venue;
    window.location.replace(
      `https://map.kakao.com/link/map/${encodeURIComponent(address)},${lat},${lng}`
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory text-sm text-muted">
      지도로 이동 중…
    </main>
  );
}
