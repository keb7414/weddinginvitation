"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";
import { asset } from "@/lib/asset";

const src = (n: number) => asset(`/images/gallery/gallery_${n}.png`);

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
            className="aspect-square overflow-hidden bg-sand"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src(i + 1)}
              alt={`갤러리 사진 ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
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

      {/* 라이트박스 — portal 로 body 에 렌더(섹션 transform 컨텍스트 탈출) */}
      {active !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90"
            onClick={() => setActive(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src(active + 1)}
              alt={`갤러리 사진 ${active + 1}`}
              className="max-h-[82vh] w-auto max-w-[88%] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-5 top-5 text-2xl text-white"
              aria-label="닫기"
            >
              ✕
            </button>
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
          </div>,
          document.body
        )}
    </Section>
  );
}
