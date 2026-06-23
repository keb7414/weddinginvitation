"use client";

import { useState } from "react";
import { Section } from "./Section";

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


  return (
    <Section className="bg-ivory text-center !pb-6">
      <div className="flex flex-col items-stretch gap-2 border-t border-sand pt-6">
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
