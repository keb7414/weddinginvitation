"use client";

import { useEffect, useState } from "react";
import { likeApi } from "@/lib/api";

/** 우측 상단 좋아요(하트) 버튼 — 누르면 likes 테이블에 누적. */
export function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      // 혼주/가족용 링크(현재 URL 에 ?host=1)일 때만 하트 숨김.
      // (과거에 host=1 로 들어왔던 기기여도, 일반 링크로 오면 하트 표시)
      const isHost =
        new URLSearchParams(window.location.search).get("host") === "1";
      if (isHost) setHidden(true);
      // 이번 세션에서 이미 눌렀으면 분홍 유지. 세션이 초기화되면(탭 종료) 다시 회색.
      if (sessionStorage.getItem("invite_liked") === "1") setLiked(true);
    } catch {
      /* 무시 */
    }
  }, []);

  if (hidden) return null;

  const like = async () => {
    setPop(true);
    setTimeout(() => setPop(false), 250);
    if (liked) return; // 세션당 한 번만 집계
    setLiked(true);
    try {
      sessionStorage.setItem("invite_liked", "1");
    } catch {
      /* 무시 */
    }
    try {
      await likeApi.add();
    } catch {
      /* 실패 시 다음 방문에 보정 */
    }
  };

  return (
    <button
      onClick={like}
      aria-label="좋아요"
      className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1ea]/90 shadow-sm backdrop-blur"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`h-[18px] w-[18px] transition-all duration-200 ${
          liked ? "text-[#f08c9a]" : "text-[#cfc8bd]"
        } ${pop ? "scale-125" : "scale-100"}`}
      >
        <path d="M12 21s-7.5-4.6-10-9.2C.6 9 1.6 5.5 4.6 4.6 6.7 4 8.7 4.8 10 6.4l2 2.4 2-2.4c1.3-1.6 3.3-2.4 5.4-1.8 3 .9 4 4.4 2.6 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
