"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/data";

/**
 * 오프닝(스플래시) 화면 — 이미지 없이 글자만, Invitation 섹션처럼 서서히 페이드업.
 *  · "정승찬 ♥ 김은별" → 그 아래 "우리 결혼합니다"
 *  · 잠시 후 자동 페이드아웃(탭하면 즉시 닫힘), 인트로 동안 본문 스크롤 잠금
 */
export function Intro() {
  const [hidden, setHidden] = useState(false); // 페이드아웃 시작
  const [gone, setGone] = useState(false); // DOM 제거

  // 일정 시간 후 자동으로 닫기 시작
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1500);
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

  const { groom, bride } = wedding;

  return (
    <div
      onClick={() => setHidden(true)}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ivory transition-opacity duration-[1100ms] ease-out ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <p
          className="text-2xl tracking-[0.15em] text-ink opacity-0 animate-introUp"
          style={{ animationDelay: "0.15s" }}
        >
          {groom.name} <span className="mx-2 text-point">♥</span> {bride.name}
        </p>
        <p
          className="mt-6 text-lg tracking-[0.25em] text-muted opacity-0 animate-introUp"
          style={{ animationDelay: "0.5s" }}
        >
          우리 결혼합니다
        </p>
      </div>
    </div>
  );
}
