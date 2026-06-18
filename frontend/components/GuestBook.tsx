"use client";

import { FormEvent, useEffect, useState } from "react";
import { Section, SectionTitle } from "./Section";
import { guestbookApi, type GuestbookEntry } from "@/lib/api";

export function GuestBook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [form, setForm] = useState({ name: "", message: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    guestbookApi
      .list()
      .then(setEntries)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

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
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    const pw = window.prompt("삭제하려면 작성 시 비밀번호를 입력하세요.");
    if (!pw) return;
    try {
      await guestbookApi.remove(id, pw);
      load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Guestbook" ko="방명록" />

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
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-point py-2.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "등록 중..." : "방명록 남기기"}
        </button>
      </form>

      <ul className="mx-auto mt-8 max-w-[340px] space-y-3">
        {entries.length === 0 && (
          <li className="text-center text-sm text-muted">
            첫 번째 축하 메시지를 남겨주세요.
          </li>
        )}
        {entries.map((g) => (
          <li key={g.id} className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-ink">{g.name}</span>
              <button
                onClick={() => remove(g.id)}
                className="text-[11px] text-muted hover:text-red-400"
              >
                삭제
              </button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink/80">
              {g.message}
            </p>
            <p className="mt-2 text-[10px] text-muted">
              {g.createdAt?.slice(0, 16).replace("T", " ")}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
