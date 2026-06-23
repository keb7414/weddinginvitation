"use client";

import { useState } from "react";
import { Section } from "./Section";
import { wedding } from "@/lib/data";

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

  const copyUrl = async () => {
    if (await copyText(window.location.href)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // 공유 — Web Share(공유 시트). 배포본(https)에서 동작.
  const shareLink = async () => {
    const url = window.location.href;
    const { groom, bride } = wedding;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${groom.name} ♥ ${bride.name} 결혼합니다`, url });
      } catch {
        /* 사용자가 취소한 경우 무시 */
      }
    }
  };

  return (
    <Section className="bg-ivory text-center !pb-6">
      <div className="flex flex-col items-stretch gap-2 border-t border-sand pt-6">
        <button
          onClick={shareLink}
          type="button"
          className="flex w-full items-center justify-center gap-2 bg-transparent py-3.5 text-sm text-ink"
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
          className="flex w-full items-center justify-center gap-2 bg-transparent py-3.5 text-sm text-ink"
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
