"use client";

import { useRef, useState } from "react";
import { wedding } from "@/lib/data";
import { asset } from "@/lib/asset";
import { FallingHearts } from "./FallingHearts";
import { LikeButton } from "./LikeButton";

export function Cover() {
  // 배경음악 — 기본은 정지 상태. 버튼을 눌러야 재생됨(자동재생 없음).
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {
        /* 브라우저가 막으면 무시 */
      });
    } else {
      el.pause();
    }
  };

  const { groom, bride, date, venue } = wedding;

  return (
    <section className="relative bg-ivory">
      {/* 하트 흩날림 */}
      <FallingHearts />

      {/* 좋아요 버튼 (우측 상단) */}
      <LikeButton />

      {/* 배경음악 버튼 (좌측 상단) — 회색 원 안에 흰 재생/정지 아이콘 */}
      <button
        onClick={toggle}
        aria-label={playing ? "배경음악 정지" : "배경음악 재생"}
        className="absolute left-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#cfc8bd]/90 shadow-sm backdrop-blur"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="white" className="h-[15px] w-[15px]">
            <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
            <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" className="ml-[2px] h-[15px] w-[15px]">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src={asset("/audio/morning-light.mp3")}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* INVITATION + 이름 */}
      <div className="px-15 pb-10 pt-[4.5rem] text-center">
        <p className="text-xs tracking-[0.4em] text-point">INVITATION</p>
        <p className="mt-3 text-xl tracking-[0.12em] text-[#5c4632]">
          {groom.name}
          <span className="mx-2 text-sm text-[#a08a73]">그리고</span>
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
      <div className="px-7 py-10 text-center">
        <p className="text-base text-muted">
          {date.year}년 {date.month}월 {date.day}일 {date.weekday} {date.timeText}
        </p>
        <p className="mt-2 text-base text-muted">{venue.name}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/images/flower.png")}
          alt=""
          className="mx-auto mt-7 h-11 w-auto"
        />
        <p className="mt-5 text-base tracking-[0.05em] text-[#5c4632]">소중한 분들을 초대합니다.</p>
      </div>
    </section>
  );
}
