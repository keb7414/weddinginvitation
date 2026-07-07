"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import { wedding } from "@/lib/data";

declare global {
  interface Window {
    Kakao?: any;
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? "";

// 보안 컨텍스트(https)가 아니어도 동작하는 복사 — 레거시 execCommand 폴백 포함
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 폴백으로 진행 */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  // 카카오 JS SDK 로드 + 초기화 (친구목록 공유에 필요)
  useEffect(() => {
    if (!KAKAO_JS_KEY) return;
    const init = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
    };
    if (window.Kakao) {
      init();
      return;
    }
    const id = "kakao-sdk";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    s.onload = init;
    document.head.appendChild(s);
  }, []);

  const copyUrl = async () => {
    if (await copyText(window.location.href)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // 카카오톡 공유 — 누르면 카톡 친구/채팅 목록이 바로 뜸.
  const shareLink = async () => {
    const url = window.location.href.split("?")[0]; // 혼주용 등 쿼리 제거
    const { groom, bride, date, venue } = wedding;
    const imageUrl = `${window.location.origin}/images/kakao.jpg?v=2`;

    // 1순위: 카카오 SDK(친구목록)
    if (window.Kakao?.Share && window.Kakao.isInitialized?.()) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `모바일 청첩장 | ${groom.name}♥${bride.name} 결혼합니다`,
          description: `${date.year}.${date.month}.${date.day} ${date.weekday} ${date.timeText}\n${venue.name}`,
          imageUrl,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          { title: "청첩장 보기", link: { mobileWebUrl: url, webUrl: url } },
        ],
      });
      return;
    }

    // 폴백: Web Share(공유 시트)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `모바일 청첩장 | ${groom.name}♥${bride.name} 결혼합니다`, url });
      } catch {
        /* 사용자가 취소한 경우 무시 */
      }
    }
  };

  return (
    <Section className="bg-ivory text-center !pb-6">
      <div className="flex flex-col items-stretch gap-1 border-t border-sand pt-4">
        <button
          onClick={shareLink}
          type="button"
          className="flex w-full items-center justify-center gap-2 bg-transparent py-2.5 text-sm text-ink"
        >
          {/* 카카오톡 말풍선 아이콘 */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] text-[#3a1d1d]">
            <path d="M12 3C6.9 3 2.8 6.3 2.8 10.3c0 2.6 1.8 4.9 4.4 6.2-.2.7-.7 2.5-.8 2.9 0 .2.1.4.3.3.3-.1 2.6-1.7 3.6-2.4.5.1 1.1.1 1.7.1 5.1 0 9.2-3.3 9.2-7.3S17.1 3 12 3z" />
          </svg>
          카카오톡으로 공유하기
        </button>

        <button
          onClick={copyUrl}
          type="button"
          className="flex w-full items-center justify-center gap-2 bg-transparent py-2.5 text-sm text-ink"
        >
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
