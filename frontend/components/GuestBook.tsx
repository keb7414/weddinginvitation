"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Section, SectionTitle } from "./Section";
import { guestbookApi } from "@/lib/api";

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M4 20h4l10-10-4-4L4 16v4z" strokeLinejoin="round" />
      <path d="M13.5 6.5l4 4" strokeLinecap="round" />
    </svg>
  );
}

export function GuestBook() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError("성함과 내용을 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 비공개 방명록 — 삭제는 관리자(신랑·신부)만 하므로 비밀번호는 고정값 사용
      await guestbookApi.create({
        name: form.name.trim(),
        message: form.message.trim(),
        password: "guest",
      });
      setForm({ name: "", message: "" });
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="bg-ivory !px-4">
      <SectionTitle ko="방명록" soft />

      {/* 안내 카드 */}
      <div className="rounded-sm border border-sand bg-white px-6 py-5 text-center shadow-sm">
        <p className="text-[15px] text-ink">신랑, 신부에게</p>
        <p className="mt-0.5 text-[15px] text-ink">축하의 글을 남겨보세요.</p>
        <p className="mt-3 text-xs text-muted">
          다른 사람은 볼 수 없으며 신랑 신부만 확인 가능합니다.
        </p>
      </div>

      {/* 작성하기 버튼 (테두리 박스) */}
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-sm border border-sand bg-white py-3 text-sm text-ink shadow-sm"
      >
        <PencilIcon />
        작성하기
      </button>

      {/* 작성 팝업 */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-6 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-[360px] overflow-hidden rounded-sm bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between px-6 pt-5">
                <span className="text-base font-medium text-ink">방명록 작성하기</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="text-xl text-muted"
                >
                  ✕
                </button>
              </div>

              {/* 안내 문구 */}
              <p className="px-6 pt-2 text-xs leading-5 text-muted">
                신랑신부님이 방명록 비공개를 선택했어요!
                <br />
                작성된 방명록은 신랑신부님 외 누구도 확인할 수 없습니다!
              </p>

              {/* 폼 */}
              <form onSubmit={submit} className="space-y-3 px-6 pb-6 pt-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="성함을 입력해주세요."
                  maxLength={50}
                  className="w-full rounded-sm bg-[#f4f2ef] px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
                />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="내용을 입력해주세요 (비방, 욕설, 정치적 성향의 글은 임의로 삭제되며 형사처벌의 대상이 될 수 있습니다.)"
                  rows={5}
                  maxLength={1000}
                  className="w-full resize-none rounded-sm bg-[#f4f2ef] px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                {done && (
                  <p className="text-xs text-point">축하 메시지가 전달되었습니다. 감사합니다.</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-ink py-3 text-sm font-medium text-white disabled:opacity-50"
                >
                  {loading ? "등록 중..." : "작성하기"}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </Section>
  );
}
