// 백엔드(invitation-api) 호출 클라이언트.
// 기본값은 로컬 8081, 운영 시 NEXT_PUBLIC_API_BASE 로 주입.

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8081/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `요청 실패 (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- 방명록 ----
export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

export const guestbookApi = {
  list: () => fetch(`${API_BASE}/guestbook`).then((r) => handle<GuestbookEntry[]>(r)),
  create: (payload: { name: string; message: string; password: string }) =>
    fetch(`${API_BASE}/guestbook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => handle<GuestbookEntry>(r)),
  remove: (id: number, password: string) =>
    fetch(`${API_BASE}/guestbook/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).then((r) => handle<void>(r)),
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
  create: (payload: RsvpPayload) =>
    fetch(`${API_BASE}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => handle<unknown>(r)),
};

// ---- 예식 알림 ----
export const alarmApi = {
  create: (payload: { contact: string; notifyAt: string }) =>
    fetch(`${API_BASE}/alarm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => handle<unknown>(r)),
};
