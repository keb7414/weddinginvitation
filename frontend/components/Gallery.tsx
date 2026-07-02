"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";
import { asset } from "@/lib/asset";

// 원본(라이트박스용) / 썸네일(그리드용 — 축소·압축본)
const src = (n: number) => asset(`/images/gallery/gallery_${n}.jpg`);
const thumb = (n: number) => asset(`/images/gallery/thumb/gallery_${n}.jpg`);

// 가로사진 번호(1-based) — 한 줄에 2개씩 표시(col-span-3). 나머지 세로사진은 3개씩(col-span-2).
// ※ 사진을 교체해 방향이 바뀌면 이 목록을 갱신하세요.
const LANDSCAPE = new Set([7, 8]);

export function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const total = wedding.galleryCount;
  const visible = expanded ? total : Math.min(6, total);

  // 라이트박스 사진 이동 (dir: -1 이전, +1 다음)
  const go = (dir: number) =>
    setActive((a) => (a === null ? a : (a + dir + total) % total));

  // 스와이프 감지
  const touchX = useRef<number | null>(null);

  // 라이트박스 열려 있을 때 앞뒤 사진을 미리 로드 → 넘길 때 즉시 표시
  useEffect(() => {
    if (active === null) return;
    [-2, -1, 1, 2].forEach((d) => {
      const n = ((active + d + total) % total) + 1;
      const im = new window.Image();
      im.src = src(n);
    });
  }, [active, total]);

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Gallery" noLine />

      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: visible }, (_, i) => {
          const n = i + 1;
          const land = LANDSCAPE.has(n);
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`overflow-hidden bg-sand ${
                land ? "col-span-3 aspect-[3/2]" : "col-span-2 aspect-square"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb(n)}
                alt={`갤러리 사진 ${n}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {total > 6 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto mt-7 flex items-center gap-1.5 text-sm text-ink/60"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="h-[18px] w-[18px]"
          >
            <circle cx="12" cy="12" r="9.5" />
            <path d="M8 12h8" strokeLinecap="round" />
            {!expanded && <path d="M12 8v8" strokeLinecap="round" />}
          </svg>
          {expanded ? "갤러리 접기" : "갤러리 더보기"}
        </button>
      )}

      {/* 라이트박스 — portal 로 body 에 렌더(섹션 transform 컨텍스트 탈출) */}
      {active !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); // 왼쪽으로 밀면 다음
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src(active + 1)}
              alt={`갤러리 사진 ${active + 1}`}
              className="max-h-[82vh] w-auto max-w-[88%] object-contain"
            />
            <button
              className="absolute right-5 top-5 text-2xl text-white"
              aria-label="닫기"
              onClick={() => setActive(null)}
            >
              ✕
            </button>
            <button
              className="absolute left-4 text-3xl text-white/80"
              aria-label="이전"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button
              className="absolute right-4 text-3xl text-white/80"
              aria-label="다음"
              onClick={() => go(1)}
            >
              ›
            </button>
          </div>,
          document.body
        )}
    </Section>
  );
}
