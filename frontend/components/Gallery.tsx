"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

// 더미: 실제 이미지 대신 색조 블록. /public/images/gallery/1.jpg ... 로 교체.
const TONES = [
  "from-sand to-point/30",
  "from-point/20 to-sand",
  "from-white to-sand",
];

export function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const total = wedding.galleryCount;
  const visible = expanded ? total : Math.min(6, total);

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Gallery" ko="갤러리" />

      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: visible }, (_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex aspect-square items-center justify-center bg-gradient-to-br ${
              TONES[i % TONES.length]
            } text-[11px] text-muted`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {total > 6 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto mt-6 block rounded-full border border-point/40 px-6 py-2 text-sm text-point"
        >
          {expanded ? "접기" : "사진 더보기"}
        </button>
      )}

      {/* 라이트박스 */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setActive(null)}
        >
          <div
            className={`flex aspect-[3/4] w-[78%] max-w-[360px] items-center justify-center bg-gradient-to-br ${
              TONES[active % TONES.length]
            } text-white`}
          >
            사진 {active + 1}
          </div>
          <button
            className="absolute right-5 top-5 text-2xl text-white"
            aria-label="닫기"
          >
            ✕
          </button>
          {/* 좌우 이동 */}
          <button
            className="absolute left-4 text-3xl text-white/80"
            aria-label="이전"
            onClick={(e) => {
              e.stopPropagation();
              setActive((a) => (a! - 1 + total) % total);
            }}
          >
            ‹
          </button>
          <button
            className="absolute right-4 text-3xl text-white/80"
            aria-label="다음"
            onClick={(e) => {
              e.stopPropagation();
              setActive((a) => (a! + 1) % total);
            }}
          >
            ›
          </button>
        </div>
      )}
    </Section>
  );
}
