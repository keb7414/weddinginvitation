"use client";

import { FormEvent, useState } from "react";
import { Section, SectionTitle } from "./Section";
import { rsvpApi, type RsvpPayload } from "@/lib/api";

const initial: RsvpPayload = {
  side: "GROOM",
  name: "",
  attend: true,
  headcount: 1,
  meal: true,
  shuttle: false,
  memo: "",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.3 14.4l-4-4 1.4-1.4 2.6 2.6 5.3-5.3 1.4 1.4-6.7 6.7z" />
    </svg>
  );
}

export function RsvpForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RsvpPayload>(initial);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("성함을 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await rsvpApi.create({ ...form, name: form.name.trim() });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Section className="bg-ivory text-center">
        <SectionTitle ko="참석 여부" soft />
        <p className="text-sm leading-7 text-ink/80">
          소중한 참석 의사 전달 감사합니다.
          <br />
          정성껏 준비하여 맞이하겠습니다.
        </p>
      </Section>
    );
  }

  const choice = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-1 rounded-md border py-2.5 text-sm ${
      active ? "border-point text-point" : "border-sand bg-[#f4f2ef] text-muted"
    }`;

  return (
    <Section className="bg-ivory">
      <SectionTitle ko="참석 여부" soft />
      <p className="mb-6 text-center text-sm leading-7 text-ink/80">
        결혼식 참석 여부를 체크해주세요.
      </p>

      {/* 펼침 토글 — 기본 접힘 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative mx-auto flex w-full items-center justify-center gap-1.5 rounded-md bg-[#f5e6df] py-3.5 text-sm text-point"
      >
        참석 여부 전달하기
        <span className="text-point">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
      <form onSubmit={submit} className="mx-auto mt-4 max-w-[340px] space-y-4">
        {/* 신랑측 / 신부측 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, side: "GROOM" })}
            className={choice(form.side === "GROOM")}
          >
            {form.side === "GROOM" && <span className="text-point">♥</span>}신랑측
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, side: "BRIDE" })}
            className={choice(form.side === "BRIDE")}
          >
            {form.side === "BRIDE" && <span className="text-point">♥</span>}신부측
          </button>
        </div>

        <div className="border-t border-sand" />

        {/* 참석여부 */}
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-sm text-ink">참석여부</span>
          <div className="flex flex-1 gap-2">
            <button type="button" onClick={() => setForm({ ...form, attend: true })} className={choice(form.attend)}>
              {form.attend && <CheckIcon />}참석
            </button>
            <button type="button" onClick={() => setForm({ ...form, attend: false })} className={choice(!form.attend)}>
              {!form.attend && <CheckIcon />}불참석
            </button>
          </div>
        </div>

        {/* 성함 */}
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-sm text-ink">성 함</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={50}
            className="flex-1 rounded-md border border-sand bg-[#f4f2ef] px-3 py-2.5 text-sm outline-none focus:border-point"
          />
        </div>

        {/* 식사예정 */}
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-sm text-ink">식사예정</span>
          <div className="flex flex-1 gap-2">
            <button type="button" onClick={() => setForm({ ...form, meal: true })} className={choice(form.meal)}>
              {form.meal && <CheckIcon />}예정
            </button>
            <button type="button" onClick={() => setForm({ ...form, meal: false })} className={choice(!form.meal)}>
              {!form.meal && <CheckIcon />}미예정
            </button>
          </div>
        </div>

        {/* 본인포함 총 N명 */}
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-sm text-ink">본인포함 총</span>
          <div className="flex flex-1 items-center gap-2">
            <input
              type="number"
              min={1}
              value={form.headcount}
              onChange={(e) => setForm({ ...form, headcount: Math.max(1, Number(e.target.value)) })}
              className="w-16 rounded-md border border-sand bg-[#f4f2ef] px-3 py-2.5 text-sm outline-none focus:border-point"
            />
            <span className="text-sm text-ink">명</span>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#e0b5a3] py-3 text-sm text-white disabled:opacity-50"
        >
          {loading ? "등록 중..." : "참석여부 등록하기"}
        </button>
      </form>
      )}
    </Section>
  );
}
