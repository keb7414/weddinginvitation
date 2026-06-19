"use client";

import { useState } from "react";
import { Section } from "./Section";

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 무시 */
    }
  };

  const shareKakao = () => {
    // Kakao SDK 연동 전 임시: 네이티브 공유 또는 안내
    if (navigator.share) {
      navigator.share({ url: window.location.href }).catch(() => {});
    } else {
      copyUrl();
    }
  };

  return (
    <Section className="bg-ivory text-center">
      <div className="flex flex-col items-center gap-5 border-t border-sand pt-8">
        <button onClick={shareKakao} className="flex items-center gap-2 text-sm text-ink">
          {/* 카카오톡 말풍선 아이콘 */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] text-[#3a1d1d]">
            <path d="M12 3C6.9 3 2.8 6.3 2.8 10.3c0 2.6 1.8 4.9 4.4 6.2-.2.7-.7 2.5-.8 2.9 0 .2.1.4.3.3.3-.1 2.6-1.7 3.6-2.4.5.1 1.1.1 1.7.1 5.1 0 9.2-3.3 9.2-7.3S17.1 3 12 3z" />
          </svg>
          카카오톡으로 공유하기
        </button>

        <button onClick={copyUrl} className="flex items-center gap-2 text-sm text-ink">
          {/* 링크 아이콘 */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-[18px] w-[18px] text-point"
          >
            <path d="M9.5 14.5l5-5" strokeLinecap="round" />
            <path d="M11 7l1.2-1.2a3.5 3.5 0 0 1 5 5L17 12" strokeLinecap="round" />
            <path d="M13 17l-1.2 1.2a3.5 3.5 0 0 1-5-5L7 12" strokeLinecap="round" />
          </svg>
          {copied ? "주소가 복사되었습니다" : "청첩장 주소 복사하기"}
        </button>
      </div>
    </Section>
  );
}
