"use client";

import { useRef, useState } from "react";
import { wedding } from "@/lib/data";

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
      {/* 음원 파일은 public/audio/bgm.mp3 로 교체 */}
      <audio ref={audioRef} loop src="/audio/bgm.mp3" />

      <p className="z-10 text-xs tracking-[0.4em] text-point">WE ARE GETTING MARRIED</p>

      {/* 대표 사진 자리 (플레이스홀더) */}
      <div className="z-10 flex w-full flex-1 items-center justify-center px-8">
        <div className="flex aspect-[3/4] w-full max-w-[280px] items-center justify-center rounded-[40%_40%_38%_38%/45%_45%_40%_40%] border border-point/40 bg-gradient-to-b from-white/60 to-sand text-sm text-muted">
          대표 사진
        </div>
      </div>

      <div className="z-10 text-center">
        <p className="text-2xl tracking-[0.15em] text-ink">
          {groom.name} <span className="mx-2 text-point">·</span> {bride.name}
        </p>
        <p className="mt-4 text-sm text-muted">
          {date.year}. {String(date.month).padStart(2, "0")}. {String(date.day).padStart(2, "0")}.{" "}
          {date.weekday} {date.timeText}
        </p>
        <p className="text-sm text-muted">{venue.name}</p>
      </div>

      <p className="z-10 animate-pulse text-[11px] tracking-[0.3em] text-muted">
        SCROLL ↓
      </p>
    </section>
  );
}
