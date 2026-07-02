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

  // 라이트박스 슬라이드(캐러셀) 상태
  const [dx, setDx] = useState(0); // 트랙 이동량(px)
  const [sliding, setSliding] = useState(false); // transition on/off
  const startX = useRef<number | null>(null);
  const pending = useRef(0); // 애니메이션 중인 이동 방향

  const vw = () => (typeof window !== "undefined" ? window.innerWidth : 0);

  // 앞뒤 사진 프리로드 → 넘길 때 즉시 표시
  useEffect(() => {
    if (active === null) return;
    [-2, -1, 1, 2].forEach((d) => {
      const n = ((active + d + total) % total) + 1;
      const im = new window.Image();
      im.src = src(n);
    });
  }, [active, total]);

  // 라이트박스 열려 있는 동안 뒤 페이지 스크롤 잠금
  useEffect(() => {
    if (active === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // dir 방향으로 슬라이드(버튼/스와이프 공통). 애니메이션 끝나면 onEnd 에서 인덱스 교체.
  const slideTo = (dir: number) => {
    pending.current = dir;
    setSliding(true);
    setDx(-dir * vw());
  };

  const onSlideEnd = () => {
    const dir = pending.current;
    if (dir === 0) {
      setSliding(false); // 스냅백 종료
      return;
    }
    pending.current = 0;
    setSliding(false);
    setDx(0);
    setActive((a) => (a === null ? a : (a + dir + total) % total));
  };

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
            className="fixed inset-0 z-[80] touch-none select-none overflow-hidden bg-black/90"
            onTouchStart={(e) => {
              startX.current = e.touches[0].clientX;
              setSliding(false);
            }}
            onTouchMove={(e) => {
              if (startX.current === null) return;
              setDx(e.touches[0].clientX - startX.current);
            }}
            onTouchEnd={(e) => {
              if (startX.current === null) return;
              const d = e.changedTouches[0].clientX - startX.current;
              startX.current = null;
              const th = 50;
              if (d < -th) slideTo(1); // 왼쪽으로 밀면 다음
              else if (d > th) slideTo(-1); // 오른쪽으로 밀면 이전
              else {
                pending.current = 0; // 스냅백
                setSliding(true);
                setDx(0);
              }
            }}
          >
            {/* 3장(이전·현재·다음) 트랙을 옆으로 이동시켜 슬라이드 효과 */}
            <div
              className="absolute inset-0 flex"
              style={{
                transform: `translateX(${-vw() + dx}px)`,
                transition: sliding ? "transform 0.28s ease-out" : "none",
              }}
              onTransitionEnd={onSlideEnd}
            >
              {[-1, 0, 1].map((off) => {
                const n = ((active + off + total) % total) + 1;
                return (
                  <div
                    key={off}
                    className="flex h-full w-screen shrink-0 items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src(n)}
                      alt={`갤러리 사진 ${n}`}
                      className="max-h-[82vh] w-auto max-w-[88%] object-contain"
                    />
                  </div>
                );
              })}
            </div>

            <button
              className="absolute right-5 top-5 z-10 text-2xl text-white"
              aria-label="닫기"
              onClick={() => setActive(null)}
            >
              ✕
            </button>
            <button
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-3xl text-white/80"
              aria-label="이전"
              onClick={() => slideTo(-1)}
            >
              ‹
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-3xl text-white/80"
              aria-label="다음"
              onClick={() => slideTo(1)}
            >
              ›
            </button>
          </div>,
          document.body
        )}
    </Section>
  );
}
