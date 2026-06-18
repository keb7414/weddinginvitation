"use client";

import { useEffect, useState } from "react";

/**
 * 오프닝(스플래시) 화면 — 진입 시 전체화면으로 잠깐 떴다가 페이드아웃.
 * 메인 커버와 다른 사진을 사용한다. (탭하면 즉시 닫힘)
 *
 * 실제 사진 교체: 아래 배경 div 를
 *   <img src="/images/intro.jpg" className="absolute inset-0 h-full w-full object-cover" />
 * 로 바꾸면 된다. (정적 배포 시 basePath 가 붙은 경로 필요)
 */
export function Intro() {
  const [hidden, setHidden] = useState(false); // 페이드아웃 시작
  const [gone, setGone] = useState(false); // DOM 제거

  // 일정 시간 후 자동으로 닫기 시작
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // 인트로 동안 본문 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 페이드아웃이 끝나면 완전히 제거 + 스크롤 해제
  useEffect(() => {
    if (!hidden) return;
    document.body.style.overflow = "";
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, [hidden]);

  if (gone) return null;

  return (
    <div
      onClick={() => setHidden(true)}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-ink transition-opacity duration-[1100ms] ease-out ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* 인트로 사진 (메인 커버와 다른 사진) — 느린 줌 */}
      <div className="absolute inset-0 animate-kenBurns bg-gradient-to-b from-[#8a7d6c] via-[#6f6557] to-[#3a3631]" />
      {/* 텍스트 가독성용 어둡게 */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/30">
        인트로 사진
      </div>

      {/* 오프닝 문구 — 순차 페이드업 */}
      <div className="relative z-10 text-center text-white">
        <p
          className="text-xs tracking-[0.4em] opacity-0 animate-introUp"
          style={{ animationDelay: "0.4s" }}
        >
          INVITATION
        </p>
        <p
          className="mt-6 text-4xl leading-relaxed tracking-[0.15em] opacity-0 animate-introUp"
          style={{ animationDelay: "0.9s" }}
        >
          우리 결혼합니다
        </p>
      </div>
    </div>
  );
}
