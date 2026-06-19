"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Section } from "./Section";
import { wedding } from "@/lib/data";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.6.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.3 1l-2.2 2.2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm.4 2L12 11.3 19.6 6H4.4zM20 7.5l-8 5.6-8-5.6V18h16V7.5z" />
    </svg>
  );
}

function ContactRow({ label, name, phone }: { label: string; name: string; phone: string }) {
  return (
    <div className="flex items-center py-3 text-sm">
      <span className="w-24 shrink-0 text-point">{label}</span>
      <span className="flex-1 text-ink">{name}</span>
      <span className="flex items-center gap-4 text-ink">
        <a href={`tel:${phone}`} aria-label="전화">
          <PhoneIcon />
        </a>
        <a href={`sms:${phone}`} aria-label="문자">
          <MailIcon />
        </a>
      </span>
    </div>
  );
}

export function ContactAccordion() {
  const [open, setOpen] = useState(false);
  const { contacts } = wedding;

  // 모달 열린 동안 본문 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Section className="bg-ivory !pt-0">
      {/* 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="mx-auto -mt-6 block w-full max-w-[300px] rounded-md bg-[#e7c6b5] py-3 text-sm text-ink/70"
      >
        연락하기
      </button>

      {/* 팝업 — portal 로 body 에 렌더(섹션 transform 컨텍스트 탈출), 배경 전체 블러 */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="relative flex items-center justify-center bg-[#e7c6b5] py-4">
                <span className="text-sm font-medium tracking-wide text-ink">연락하기</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="absolute right-4 text-lg text-white"
                >
                  ✕
                </button>
              </div>

              {/* 목록 */}
              <div className="px-6 py-3">
                {contacts.groom.map((c) => (
                  <ContactRow key={c.label} label={c.label} name={c.name} phone={c.phone} />
                ))}
                <div className="my-1 border-t border-sand" />
                {contacts.bride.map((c) => (
                  <ContactRow key={c.label} label={c.label} name={c.name} phone={c.phone} />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </Section>
  );
}
