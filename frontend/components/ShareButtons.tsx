"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";

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
      <SectionTitle en="Share" ko="공유하기" />
      <div className="flex justify-center gap-3">
        <button
          onClick={shareKakao}
          className="rounded-full bg-[#fee500] px-6 py-2.5 text-sm text-[#3a1d1d]"
        >
          카카오톡 공유
        </button>
        <button
          onClick={copyUrl}
          className="rounded-full border border-point/40 px-6 py-2.5 text-sm text-point"
        >
          {copied ? "복사됨" : "URL 복사"}
        </button>
      </div>
    </Section>
  );
}
