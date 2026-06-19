"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  guestbookApi,
  rsvpApi,
  visitApi,
  type GuestbookEntry,
  type RsvpEntry,
  type VisitInfo,
} from "@/lib/api";

// user agent → 간단한 기기/브라우저 표기
function deviceLabel(ua: string | null) {
  if (!ua) return "알 수 없음";
  const os = /iPhone|iPad|iOS/i.test(ua)
    ? "iOS"
    : /Android/i.test(ua)
      ? "Android"
      : /Windows/i.test(ua)
        ? "Windows"
        : /Mac/i.test(ua)
          ? "Mac"
          : "기타";
  const br = /KAKAOTALK/i.test(ua)
    ? "카카오톡"
    : /Edg/i.test(ua)
      ? "Edge"
      : /Chrome/i.test(ua)
        ? "Chrome"
        : /Safari/i.test(ua)
          ? "Safari"
          : "브라우저";
  return `${os} · ${br}`;
}

// 관리자 비밀번호 — 필요 시 이 값만 바꾸면 됩니다.
const ADMIN_PW = "1031";

function fmt(ts: string) {
  // "2026-06-19T12:34:56..." → "2026.06.19 12:34"
  if (!ts) return "";
  const [d, t = ""] = ts.split("T");
  return `${d.replace(/-/g, ".")} ${t.slice(0, 5)}`;
}

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [guests, setGuests] = useState<GuestbookEntry[]>([]);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [visits, setVisits] = useState<number | null>(null);
  const [visitLog, setVisitLog] = useState<VisitInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 세션 동안 인증 유지
  useEffect(() => {
    if (sessionStorage.getItem("dash_authed") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([
      guestbookApi.list(),
      rsvpApi.list(),
      visitApi.count(),
      visitApi.recent(100),
    ])
      .then(([g, r, v, vl]) => {
        setGuests(g);
        setRsvps(r);
        setVisits(v);
        setVisitLog(vl);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [authed]);

  const stats = useMemo(() => {
    const attend = rsvps.filter((r) => r.attend);
    const head = attend.reduce((s, r) => s + (r.headcount || 0), 0);
    return {
      total: rsvps.length,
      attendCount: attend.length,
      declineCount: rsvps.length - attend.length,
      headcount: head,
      mealCount: attend.filter((r) => r.meal).reduce((s, r) => s + (r.headcount || 0), 0),
      groom: attend.filter((r) => r.side === "GROOM").length,
      bride: attend.filter((r) => r.side === "BRIDE").length,
    };
  }, [rsvps]);

  const submitPw = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PW) {
      sessionStorage.setItem("dash_authed", "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <form onSubmit={submitPw} className="w-full max-w-[320px] text-center">
          <h1 className="mb-6 text-lg tracking-wide text-ink">관리자 확인</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-md border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-point"
          />
          {pwError && <p className="mt-2 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-point py-3 text-sm text-white"
          >
            확인
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-center text-xl tracking-wide text-ink">관리자 대시보드</h1>
        <p className="mb-6 text-center text-xs text-muted">방명록 · 참석여부 현황</p>

        {/* 방문자 수 */}
        <div className="mb-8 rounded-md border border-sand bg-white px-5 py-4 text-center">
          <p className="text-[11px] text-muted">방문자 수 (같은 기기 1회)</p>
          <p className="mt-1 text-2xl font-medium text-point">
            {visits === null ? "—" : visits.toLocaleString()}
          </p>
        </div>

        {loading && <p className="text-center text-sm text-muted">불러오는 중...</p>}
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* 참석여부 요약 */}
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-medium text-point">참석여부</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "응답", value: stats.total },
                  { label: "참석", value: stats.attendCount },
                  { label: "미참석", value: stats.declineCount },
                  { label: "총 인원", value: stats.headcount },
                  { label: "식사 인원", value: stats.mealCount },
                  { label: "신랑/신부측", value: `${stats.groom}/${stats.bride}` },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-md border border-sand bg-white px-3 py-4 text-center"
                  >
                    <p className="text-lg font-medium text-ink">{c.value}</p>
                    <p className="mt-1 text-[11px] text-muted">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* 참석여부 목록 */}
              <div className="mt-4 overflow-hidden rounded-md border border-sand bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sand/50 text-xs text-muted">
                      <th className="px-3 py-2 text-left font-normal">측</th>
                      <th className="px-3 py-2 text-left font-normal">이름</th>
                      <th className="px-3 py-2 text-center font-normal">참석</th>
                      <th className="px-3 py-2 text-center font-normal">인원</th>
                      <th className="px-3 py-2 text-center font-normal">식사</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-muted">
                          아직 응답이 없습니다.
                        </td>
                      </tr>
                    )}
                    {rsvps.map((r) => (
                      <tr key={r.id} className="border-t border-sand">
                        <td className="px-3 py-2.5 text-ink/80">
                          {r.side === "GROOM" ? "신랑" : "신부"}
                        </td>
                        <td className="px-3 py-2.5 text-ink">{r.name}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={r.attend ? "text-point" : "text-muted"}>
                            {r.attend ? "O" : "X"}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center text-ink/80">{r.headcount}</td>
                        <td className="px-3 py-2.5 text-center text-ink/80">
                          {r.meal ? "O" : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 접속 기록 */}
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-medium text-point">
                접속 기록 <span className="text-muted">({visitLog.length})</span>
              </h2>
              <ul className="space-y-2">
                {visitLog.length === 0 && (
                  <li className="rounded-md border border-sand bg-white px-4 py-6 text-center text-sm text-muted">
                    아직 접속 기록이 없습니다.
                  </li>
                )}
                {visitLog.map((v) => (
                  <li
                    key={v.visitor_id}
                    className="rounded-md border border-sand bg-white px-4 py-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-ink">{deviceLabel(v.user_agent)}</span>
                      <span className="text-[11px] text-muted">{fmt(v.created_at)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      경로 {v.path || "/"} · 유입 {v.referrer ? v.referrer : "직접"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 방명록 */}
            <section>
              <h2 className="mb-3 text-sm font-medium text-point">
                방명록 <span className="text-muted">({guests.length})</span>
              </h2>
              <ul className="space-y-2">
                {guests.length === 0 && (
                  <li className="rounded-md border border-sand bg-white px-4 py-6 text-center text-sm text-muted">
                    아직 방명록이 없습니다.
                  </li>
                )}
                {guests.map((g) => (
                  <li key={g.id} className="rounded-md border border-sand bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">{g.name}</span>
                      <span className="text-[11px] text-muted">{fmt(g.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink/80">
                      {g.message}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
