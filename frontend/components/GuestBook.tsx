"use client";

import { FormEvent, useState } from "react";
import { Section, SectionTitle } from "./Section";
import { guestbookApi } from "@/lib/api";

export function GuestBook() {
  const [form, setForm] = useState({ name: "", message: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message || !form.password) {
      setError("이름·메시지·비밀번호를 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await guestbookApi.create(form);
      setForm({ name: "", message: "", password: "" });
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Guestbook" ko="방명록" />
      <p className="mb-6 text-center text-xs text-muted">
        남겨주신 축하 메시지는 신랑·신부에게만 전달됩니다.
      </p>

      <form onSubmit={submit} className="mx-auto max-w-[340px] space-y-2">
        <div className="flex gap-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="이름"
            maxLength={50}
            className="w-1/2 rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="비밀번호"
            type="password"
            maxLength={30}
            className="w-1/2 rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
          />
        </div>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="축하 메시지를 남겨주세요"
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-point"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {done && (
          <p className="text-xs text-point">축하 메시지가 전달되었습니다. 감사합니다.</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-point py-2.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "등록 중..." : "방명록 남기기"}
        </button>
      </form>
    </Section>
  );
}
