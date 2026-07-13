// 백엔드 = Supabase(BaaS). 브라우저가 anon 키로 직접 호출한다.
// 컴포넌트는 이 모듈의 동일한 export 를 그대로 사용 (Spring 버전과 시그니처 호환).

import { supabase } from "./supabase";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

// 방문자 식별자 해석 — 핑거프린트 우선(저장소 삭제에도 유지), 실패 시 localStorage UUID 폴백.
let fpAgent: Promise<{ get: () => Promise<{ visitorId: string }> }> | null = null;

async function resolveVisitorId(): Promise<string> {
  try {
    fpAgent = fpAgent ?? FingerprintJS.load();
    const agent = await fpAgent;
    const { visitorId } = await agent.get();
    if (visitorId) {
      localStorage.setItem("invite_visitor_id", visitorId); // 캐시
      return visitorId;
    }
  } catch {
    /* 핑거프린트 실패 → 폴백 */
  }
  let id = localStorage.getItem("invite_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("invite_visitor_id", id);
  }
  return id;
}

// ---- 방명록 ----
export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

export const guestbookApi = {
  list: async (): Promise<GuestbookEntry[]> => {
    const { data, error } = await supabase
      .from("guestbook_public")
      .select("id, name, message, created_at")
      .order("id", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as number,
      name: r.name as string,
      message: r.message as string,
      createdAt: r.created_at as string,
    }));
  },

  create: async (payload: { name: string; message: string; password: string }) => {
    const { error } = await supabase.from("guestbook").insert({
      name: payload.name,
      message: payload.message,
      password: payload.password,
    });
    if (error) throw new Error(error.message);
  },

  remove: async (id: number, password: string) => {
    const { data, error } = await supabase.rpc("delete_guestbook", {
      p_id: id,
      p_password: password,
    });
    if (error) throw new Error(error.message);
    if (data !== true) throw new Error("비밀번호가 일치하지 않습니다.");
  },
};

// ---- 참석 의사 ----
export type RsvpPayload = {
  side: "GROOM" | "BRIDE";
  name: string;
  attend: boolean;
  headcount: number;
  meal: boolean;
  shuttle: boolean;
  memo?: string;
};

export type RsvpEntry = {
  id: number;
  side: "GROOM" | "BRIDE";
  name: string;
  attend: boolean;
  headcount: number;
  meal: boolean;
  shuttle: boolean;
  memo: string | null;
  createdAt: string;
};

export const rsvpApi = {
  create: async (payload: RsvpPayload) => {
    const { error } = await supabase.from("rsvp").insert({
      side: payload.side,
      name: payload.name,
      attend: payload.attend,
      headcount: payload.headcount,
      meal: payload.meal,
      shuttle: payload.shuttle,
      memo: payload.memo ?? null,
    });
    if (error) throw new Error(error.message);
  },

  // 관리자 대시보드용 — rsvp SELECT 정책 필요 (아래 schema.sql 참고)
  list: async (): Promise<RsvpEntry[]> => {
    const { data, error } = await supabase
      .from("rsvp")
      .select("id, side, name, attend, headcount, meal, shuttle, memo, created_at")
      .order("id", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as number,
      side: r.side as "GROOM" | "BRIDE",
      name: r.name as string,
      attend: r.attend as boolean,
      headcount: r.headcount as number,
      meal: r.meal as boolean,
      shuttle: r.shuttle as boolean,
      memo: (r.memo as string | null) ?? null,
      createdAt: r.created_at as string,
    }));
  },
};

// ---- 방문자 ----
export type VisitInfo = {
  visitor_id: string;
  user_agent: string | null;
  referrer: string | null;
  path: string | null;
  created_at: string; // 최초 방문
  last_seen: string; // 최근 방문
  visit_count: number; // 방문 횟수(재방문 포함)
};

export const visitApi = {
  // 기기당 1행. 최초 방문은 새 행, 재방문은 last_seen/visit_count 갱신.
  track: async () => {
    if (typeof window === "undefined") return;
    // 로컬/LAN(개발 환경) 접속은 집계 제외 — 실제 배포 방문만 카운트
    const host = window.location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local")
    ) {
      return;
    }
    // 관리자 대시보드 접속은 집계 제외
    if (window.location.pathname.includes("/dashboard")) return;
    // 혼주/가족용 링크(?host=1)는 집계 제외. 한 번 들어오면 그 기기는 이후에도 계속 제외.
    // ?host=0 으로 접속하면 그 기기의 제외를 해제(다시 집계).
    try {
      const hostParam = new URLSearchParams(window.location.search).get("host");
      if (hostParam === "1") {
        localStorage.setItem("invite_host", "1");
      } else if (hostParam === "0") {
        localStorage.removeItem("invite_host");
      }
      if (localStorage.getItem("invite_host") === "1") return;
    } catch {
      /* 무시 */
    }
    // 핑거프린트(우선) 또는 localStorage UUID 로 기기 식별
    const id = await resolveVisitorId();
    // RPC(SECURITY DEFINER) 로 기록 — 최초 방문은 INSERT, 재방문은 last_seen/횟수 갱신.
    // anon 에 UPDATE 권한을 직접 주지 않아도 되므로 안전하다.
    await supabase.rpc("visit_track", {
      p_visitor_id: id,
      p_user_agent: navigator.userAgent,
      p_referrer: document.referrer || null,
      p_path: window.location.pathname,
      p_language: navigator.language,
    });
    // 집계 실패는 사용자 경험에 영향 없으므로 조용히 무시
  },

  count: async (): Promise<number> => {
    const { data, error } = await supabase.rpc("visit_count");
    if (error) throw new Error(error.message);
    return (data as number) ?? 0;
  },

  recent: async (limit = 100): Promise<VisitInfo[]> => {
    const { data, error } = await supabase.rpc("visit_recent", { p_limit: limit });
    if (error) throw new Error(error.message);
    return (data ?? []) as VisitInfo[];
  },
};

// ---- 좋아요 ----
export const likeApi = {
  count: async (): Promise<number> => {
    const { data, error } = await supabase.rpc("like_count");
    if (error) throw new Error(error.message);
    return (data as number) ?? 0;
  },

  add: async () => {
    let vid: string | null = null;
    try {
      vid = localStorage.getItem("invite_visitor_id");
    } catch {
      /* 무시 */
    }
    const { error } = await supabase.from("likes").insert({ visitor_id: vid });
    if (error) throw new Error(error.message);
  },
};

// ---- 예식 알림 (저장만) ----
export const alarmApi = {
  create: async (payload: { contact: string; notifyAt: string }) => {
    const { error } = await supabase.from("alarm").insert({
      contact: payload.contact,
      notify_at: payload.notifyAt,
    });
    if (error) throw new Error(error.message);
  },
};
