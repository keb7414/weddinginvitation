// 백엔드 = Supabase(BaaS). 브라우저가 anon 키로 직접 호출한다.
// 컴포넌트는 이 모듈의 동일한 export 를 그대로 사용 (Spring 버전과 시그니처 호환).

import { supabase } from "./supabase";

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
