"use client";

import { FormEvent, useState } from "react";
import { Section, SectionTitle } from "./Section";
import { alarmApi } from "@/lib/api";
import { wedding } from "@/lib/data";

// 알림 시점 옵션 — 예식일 기준 N일 전 09:00
const OPTIONS = [
  { label: "하루 전", days: 1 },
  { label: "3일 전", days: 3 },
  { label: "일주일 전", days: 7 },
];

function notifyAtFor(days: number): string {
  const d = new Date(wedding.date.iso);
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  // 로컬 시간 기준 ISO(LocalDateTime 형식: yyyy-MM-ddTHH:mm:ss)
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:00`;
}

export function AlarmRegister() {
  const [contact, setContact] = useState("");
  const [days, setDays] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      setError("연락처를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await alarmApi.create({ contact: contact.trim(), notifyAt: notifyAtFor(days) });
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
        <SectionTitle en="Reminder" ko="예식 알림 신청" />
        <p className="text-sm leading-7 text-ink/80">
          알림 신청이 완료되었습니다.
          <br />
          예식 전 잊지 않도록 안내해 드리겠습니다.
        </p>
      </Section>
    );
  }

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Reminder" ko="예식 알림 신청" />
      <p className="mb-6 text-center text-sm leading-7 text-ink/80">
        예식을 잊지 않도록 알림을 보내드릴게요.
      </p>

      <form onSubmit={submit} className="mx-auto max-w-[340px] space-y-4">
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="연락처 (휴대폰 또는 이메일)"
          maxLength={100}
          className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
        />
        <div>
          <p className="mb-1.5 text-xs text-muted">알림 시점</p>
          <div className="flex gap-2">
            {OPTIONS.map((o) => (
              <button
                type="button"
                key={o.days}
                onClick={() => setDays(o.days)}
                className={`flex-1 rounded-lg border py-2 text-sm ${
                  days === o.days
                    ? "border-point bg-point text-white"
                    : "border-sand bg-white text-ink"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-point py-2.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "신청 중..." : "알림 신청하기"}
        </button>
      </form>
    </Section>
  );
}
