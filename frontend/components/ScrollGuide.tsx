"use client";

import { useEffect, useState } from "react";

/**
 * 화면 하단 스크롤 안내.
 *  - 처음(오프닝)부터 떠 있고 오프닝에 가려졌다가 드러난다.
 *  - 약 2초 표시 후 자동으로 사라지며, 스크롤이 내려가면 즉시 사라진다.
 *  - 하단에 옅은 검은 그라데이션을 깔아 밝은 안내가 잘 보이게 한다.
 */
export function ScrollGuide() {
  const [show, setShow] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let fade: ReturnType<typeof setTimeout>;
    const hide = () => {
      setShow(false);
      fade = setTimeout(() => setGone(true), 700);
    };
    // 오프닝(≈2.6s)이 사라진 뒤 약 2초간 보이도록
    const auto = setTimeout(hide, 4500);
    const onScroll = () => {
      if (window.scrollY > 10) {
        hide();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(auto);
      clearTimeout(fade);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex flex-col items-center bg-gradient-to-t from-black/70 via-black/30 to-transparent pb-10 pt-24 transition-opacity duration-700 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 마우스 모양 아이콘 */}
      <span className="flex h-10 w-7 justify-center rounded-2xl border-2 border-white/70">
        <span className="mt-2 h-2 w-1.5 animate-bounce rounded-full bg-white/80" />
      </span>
      <span className="mt-2 text-xs tracking-[0.2em] text-white/85">스크롤 해주세요.</span>
    </div>
  );
}
