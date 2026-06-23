"use client";

import { useEffect, useState } from "react";
import { likeApi } from "@/lib/api";

/** 우측 상단 좋아요(하트) 버튼 — 누르면 likes 테이블에 누적. */
export function LikeButton() {
  const [count, setCount] = useState<number | null>(null);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    likeApi.count().then(setCount).catch(() => {});
  }, []);

  const like = async () => {
    setCount((c) => (c ?? 0) + 1); // 낙관적 반영
    setPop(true);
    setTimeout(() => setPop(false), 250);
    try {
      await likeApi.add();
    } catch {
      /* 실패 시 카운트는 다음 새로고침에 보정 */
    }
  };

  return (
    <button
      onClick={like}
      aria-label="좋아요"
      className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`h-[18px] w-[18px] text-[#e2545f] transition-transform ${pop ? "scale-125" : "scale-100"}`}
      >
        <path d="M12 21s-7.5-4.6-10-9.2C.6 9 1.6 5.5 4.6 4.6 6.7 4 8.7 4.8 10 6.4l2 2.4 2-2.4c1.3-1.6 3.3-2.4 5.4-1.8 3 .9 4 4.4 2.6 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
      <span className="min-w-[14px] text-xs font-medium text-ink">
        {count === null ? "" : count.toLocaleString()}
      </span>
    </button>
  );
}
