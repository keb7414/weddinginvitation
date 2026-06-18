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
    <section className="relative flex h-[100svh] flex-col items-center justify-between overflow-hidden bg-sand py-14">
      {/* BGM 토글 */}
      <button
        onClick={toggle}
        aria-label="배경음악 재생/정지"
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-ink shadow-sm backdrop-blur"
      >
        {playing ? "❚❚" : "♪"}
      </button>
      <audio ref={audioRef} loop src={asset("/audio/bgm.mp3")} />

      <p
        className="z-10 text-xs tracking-[0.4em] text-point opacity-0 animate-introUp"
        style={{ animationDelay: "0.6s" }}
      >
        WE ARE GETTING MARRIED
      </p>

      {/* 대표 사진 — 확대된 상태에서 서서히 나타난 뒤 아주 느린 줌(켄번스) */}
      <div className="z-10 flex w-full flex-1 items-center justify-center px-8">
        <div className="aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-[40%_40%_38%_38%/45%_45%_40%_40%] border border-point/40 opacity-0 animate-coverReveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/images/main.jpg")}
            alt="신랑 신부 대표 사진"
            className="h-full w-full animate-kenBurns object-cover"
          />
        </div>
      </div>

      <div className="z-10 text-center">
        <p
          className="text-2xl tracking-[0.15em] text-ink opacity-0 animate-introUp"
          style={{ animationDelay: "1.0s" }}
        >
          {groom.name} <span className="mx-2 text-point">·</span> {bride.name}
        </p>
        <p
          className="mt-4 text-sm text-muted opacity-0 animate-introUp"
          style={{ animationDelay: "1.3s" }}
        >
          {date.year}. {String(date.month).padStart(2, "0")}. {String(date.day).padStart(2, "0")}.{" "}
          {date.weekday} {date.timeText}
        </p>
        <p
          className="text-sm text-muted opacity-0 animate-introUp"
          style={{ animationDelay: "1.5s" }}
        >
          {venue.name}
        </p>
      </div>

      <span
        className="z-10 opacity-0 animate-introUp"
        style={{ animationDelay: "2s" }}
      >
        <span className="block animate-pulse text-[11px] tracking-[0.3em] text-muted">
          SCROLL ↓
        </span>
      </span>
    </section>
  );
}
