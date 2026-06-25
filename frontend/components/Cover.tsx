"use client";

import { wedding } from "@/lib/data";
import { asset } from "@/lib/asset";
import { FallingHearts } from "./FallingHearts";
import { LikeButton } from "./LikeButton";

export function Cover() {
  // ===== 배경음악(BGM) — 현재 숨김. 살리려면 아래 블록과 JSX의 BGM 주석을 해제 =====
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [playing, setPlaying] = useState(false);
  //
  // const toggle = () => {
  //   const el = audioRef.current;
  //   if (!el) return;
  //   if (playing) {
  //     el.pause();
  //   } else {
  //     el.play().catch(() => {/* 자동재생 차단 시 무시 */});
  //   }
  //   setPlaying(!playing);
  // };
  //
  // // 기본은 정지, 첫 화면 터치/클릭 시 1회 자동 재생 (모바일 자동재생 정책 대응)
  // useEffect(() => {
  //   const startOnce = () => {
  //     const el = audioRef.current;
  //     if (el && el.paused) {
  //       el.play()
  //         .then(() => setPlaying(true))
  //         .catch(() => {/* 차단 시 무시 — 버튼으로 재생 */});
  //     }
  //   };
  //   document.addEventListener("pointerdown", startOnce, { once: true });
  //   return () => document.removeEventListener("pointerdown", startOnce);
  // }, []);
  // ===========================================================================

  const { groom, bride, date, venue } = wedding;

  return (
    <section className="relative bg-ivory">
      {/* 하트 흩날림 */}
      <FallingHearts />

      {/* 좋아요 버튼 (우측 상단) */}
      <LikeButton />

      {/* ===== 배경음악(BGM) 버튼·오디오 — 현재 숨김. 살리려면 주석 해제 =====
      <button
        onClick={toggle}
        aria-label="배경음악 재생/정지"
        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ece4]/90 shadow-sm backdrop-blur"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#b3a89a]">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#b3a89a]">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} loop src={asset("/audio/bgm.mp3")} />
      ===================================================================== */}

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
        src={asset("/images/main2.jpg")}
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
