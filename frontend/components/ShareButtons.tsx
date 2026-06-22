"use client";

import { useState } from "react";
import { Section } from "./Section";
import { wedding } from "@/lib/data";

declare global {
  interface Window {
    Kakao: any;
  }
}

// 지도와 동일한 카카오 JavaScript 키
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Kakao SDK 로드 + 초기화(1회)
function ensureKakao(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY);
      return resolve(window.Kakao);
    }
    const s = document.createElement("script");
    s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    s.async = true;
    s.onload = () => {
      window.Kakao.init(KAKAO_KEY);
      resolve(window.Kakao);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

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

  const shareKakao = async () => {
    if (!KAKAO_KEY) {
      copyUrl();
      return;
    }
    const url = window.location.href;
    const imageUrl = `${window.location.origin}${BASE_PATH}/images/main.jpg`;
    const { groom, bride, date, venue } = wedding;
    try {
      const Kakao = await ensureKakao();
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${groom.name} ♥ ${bride.name} 결혼합니다`,
          description: `${date.year}. ${date.month}. ${date.day} ${date.weekday} ${date.timeText} · ${venue.name}`,
          imageUrl,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    } catch {
      // SDK 실패 시 폴백
      if (navigator.share) navigator.share({ url }).catch(() => {});
      else copyUrl();
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
