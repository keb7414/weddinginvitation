"use client";

import { useRef, useState } from "react";
import { wedding } from "@/lib/data";
import { asset } from "@/lib/asset";

export function Cover() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play().catch(() => {/* 자동재생 차단 시 무시 */});
    }
    setPlaying(!playing);
  };

  const { groom, bride, date, venue } = wedding;

  return (
    <section className="relative bg-ivory">
      {/* BGM 토글 */}
      <button
        onClick={toggle}
        aria-label="배경음악 재생/정지"
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur"
      >
        {playing ? "❚❚" : "♪"}
      </button>
      <audio ref={audioRef} loop src={asset("/audio/bgm.mp3")} />

      {/* INVITATION + 이름 */}
      <div className="px-7 pb-5 pt-7 text-center">
        <p className="text-xs tracking-[0.4em] text-point">INVITATION</p>
        <p className="mt-3 text-xl tracking-[0.12em] text-ink">
          {groom.name}
          <span className="mx-2 text-sm text-muted">그리고</span>
          {bride.name}
        </p>
      </div>

      {/* 대표 사진 — 가공 없이 사각형 그대로, 전체 폭 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/main.jpg")}
        alt="신랑 신부 대표 사진"
        className="block w-full animate-introUp"
      />

      {/* 날짜 · 장소 · 초대 문구 */}
      <div className="px-7 py-6 text-center">
        <p className="text-sm text-muted">
          {date.year}년 {date.month}월 {date.day}일 {date.weekday} {date.timeText}
        </p>
        <p className="mt-1 text-sm text-muted">{venue.name}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/images/flower.png")}
          alt=""
          className="mx-auto mt-4 h-11 w-auto"
        />
        <p className="mt-2 text-base tracking-[0.05em] text-ink">결혼식에 초대합니다</p>
      </div>
    </section>
  );
}
