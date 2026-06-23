"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  guestbookApi,
  rsvpApi,
  visitApi,
  type GuestbookEntry,
  type RsvpEntry,
  type VisitInfo,
} from "@/lib/api";

// 신랑측/신부측 참석여부 테이블 (하단 합계 포함)
function RsvpTable({ title, rows }: { title: string; rows: RsvpEntry[] }) {
  const attendees = rows.filter((r) => r.attend);
  const headcount = attendees.reduce((s, r) => s + (r.headcount || 0), 0);
  const mealCount = attendees
    .filter((r) => r.meal)
    .reduce((s, r) => s + (r.headcount || 0), 0);

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-ink">{title}</h3>
      <div className="overflow-hidden rounded-md border border-sand bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand/50 text-xs text-muted">
              <th className="px-3 py-2 text-left font-normal">이름</th>
              <th className="px-3 py-2 text-center font-normal">참석</th>
              <th className="px-3 py-2 text-center font-normal">인원</th>
              <th className="px-3 py-2 text-center font-normal">식사</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted">
                  응답 없음
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-sand">
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
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t border-sand bg-ivory text-xs font-medium">
                <td className="px-3 py-2.5 text-muted">합계 · 참석 {attendees.length}</td>
                <td className="px-3 py-2.5" />
                <td className="px-3 py-2.5 text-center text-ink">{headcount}명</td>
                <td className="px-3 py-2.5 text-center text-ink">{mealCount}명</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

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

// 유입 referrer → 호스트명만 표시
function hostOf(url: string | null) {
  if (!url) return "직접";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
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

  const [hostLink, setHostLink] = useState("");
  const [hostCopied, setHostCopied] = useState(false);

  // 세션 동안 인증 유지 + 혼주용 링크 계산
  useEffect(() => {
    if (sessionStorage.getItem("dash_authed") === "1") setAuthed(true);
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    setHostLink(`${window.location.origin}${base}/?host=1`);
  }, []);

  const copyHostLink = async () => {
    try {
      await navigator.clipboard.writeText(hostLink);
      setHostCopied(true);
      setTimeout(() => setHostCopied(false), 1500);
    } catch {
      /* 무시 */
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    // 각 항목을 독립적으로 로드 — 하나가 실패해도 나머지는 표시
    (async () => {
      const errs: string[] = [];
      const [g, r, v, vl] = await Promise.allSettled([
        guestbookApi.list(),
        rsvpApi.list(),
        visitApi.count(),
        visitApi.recent(100),
      ]);
      if (g.status === "fulfilled") setGuests(g.value);
      else errs.push("방명록: " + g.reason.message);
      if (r.status === "fulfilled") setRsvps(r.value);
      else errs.push("참석여부: " + r.reason.message);
      if (v.status === "fulfilled") setVisits(v.value);
      else errs.push("방문자수: " + v.reason.message);
      if (vl.status === "fulfilled") setVisitLog(vl.value);
      else errs.push("접속기록: " + vl.reason.message);
      setError(errs.length ? errs.join(" / ") : null);
      setLoading(false);
    })();
  }, [authed]);

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
        <div className="mb-3 rounded-md border border-sand bg-white px-5 py-4 text-center">
          <p className="text-[11px] text-muted">방문자 수 (같은 기기 1회)</p>
          <p className="mt-1 text-2xl font-medium text-point">
            {visits === null ? "—" : visits.toLocaleString()}
          </p>
        </div>

        {/* 혼주/가족용 링크 — 방문수 집계 제외 */}
        <div className="mb-8 rounded-md border border-sand bg-white px-5 py-4">
          <p className="text-[11px] text-muted">혼주·가족용 링크 (방문수 집계 제외)</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              readOnly
              value={hostLink}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 rounded bg-sand/40 px-2 py-1.5 text-xs text-ink outline-none"
            />
            <button
              onClick={copyHostLink}
              className="shrink-0 rounded bg-point px-3 py-1.5 text-xs text-white"
            >
              {hostCopied ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            이 링크로 한 번 접속한 기기는 이후 일반 링크로 봐도 방문수에 집계되지 않습니다.
          </p>
        </div>

        {loading && <p className="text-center text-sm text-muted">불러오는 중...</p>}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-center text-xs text-red-500">{error}</p>
        )}

        {!loading && (
          <>
            {/* 참석여부 — 신랑측/신부측 테이블 */}
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-medium text-point">참석여부</h2>
              <div className="space-y-6">
                <RsvpTable
                  title="신랑측"
                  rows={rsvps.filter((r) => r.side === "GROOM")}
                />
                <RsvpTable
                  title="신부측"
                  rows={rsvps.filter((r) => r.side === "BRIDE")}
                />
              </div>
            </section>

            {/* 접속 기록 */}
            <section className="mb-10">
              <h2 className="mb-3 text-sm font-medium text-point">
                접속 기록 <span className="text-muted">({visitLog.length})</span>
              </h2>
              <div className="overflow-x-auto rounded-md border border-sand bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sand/50 text-xs text-muted">
                      <th className="whitespace-nowrap px-3 py-2 text-left font-normal">기기</th>
                      <th className="whitespace-nowrap px-3 py-2 text-left font-normal">유입</th>
                      <th className="whitespace-nowrap px-3 py-2 text-left font-normal">경로</th>
                      <th className="whitespace-nowrap px-3 py-2 text-left font-normal">시각</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitLog.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-6 text-center text-muted">
                          아직 접속 기록이 없습니다.
                        </td>
                      </tr>
                    )}
                    {visitLog.map((v) => (
                      <tr key={v.visitor_id} className="border-t border-sand">
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink">
                          {deviceLabel(v.user_agent)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink/80">
                          {hostOf(v.referrer)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink/80">
                          {v.path || "/"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-muted">
                          {fmt(v.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
