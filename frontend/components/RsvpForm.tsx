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

export function RsvpForm() {
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
        <SectionTitle en="RSVP" ko="참석 의사 전달" />
        <p className="text-sm leading-7 text-ink/80">
          소중한 참석 의사 전달 감사합니다.
          <br />
          정성껏 준비하여 맞이하겠습니다.
        </p>
      </Section>
    );
  }

  const radio = (checked: boolean) =>
    `flex-1 rounded-lg border py-2 text-sm ${
      checked ? "border-point bg-point text-white" : "border-sand bg-white text-ink"
    }`;

  return (
    <Section className="bg-ivory">
      <SectionTitle en="RSVP" ko="참석 의사 전달" />
      <p className="mb-6 text-center text-sm leading-7 text-ink/80">
        원활한 진행을 위해 참석 여부를 알려주세요.
      </p>

      <form onSubmit={submit} className="mx-auto max-w-[340px] space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, side: "GROOM" })}
            className={radio(form.side === "GROOM")}
          >
            신랑측
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, side: "BRIDE" })}
            className={radio(form.side === "BRIDE")}
          >
            신부측
          </button>
        </div>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="성함"
          maxLength={50}
          className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
        />

        <div>
          <p className="mb-1.5 text-xs text-muted">참석 여부</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, attend: true })}
              className={radio(form.attend)}
            >
              참석
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, attend: false })}
              className={radio(!form.attend)}
            >
              미참석
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-muted">참석 인원 (본인 포함)</p>
          <input
            type="number"
            min={1}
            value={form.headcount}
            onChange={(e) =>
              setForm({ ...form, headcount: Math.max(1, Number(e.target.value)) })
            }
            className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
          />
        </div>

        <div className="flex gap-2">
          <label className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand bg-white py-2 text-sm">
            <input
              type="checkbox"
              checked={form.meal}
              onChange={(e) => setForm({ ...form, meal: e.target.checked })}
            />
            식사함
          </label>
          <label className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-sand bg-white py-2 text-sm">
            <input
              type="checkbox"
              checked={form.shuttle}
              onChange={(e) => setForm({ ...form, shuttle: e.target.checked })}
            />
            셔틀버스
          </label>
        </div>

        <textarea
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          placeholder="전달사항 (선택)"
          rows={2}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-point py-2.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "전달 중..." : "참석 의사 전달하기"}
        </button>
      </form>
    </Section>
  );
}
