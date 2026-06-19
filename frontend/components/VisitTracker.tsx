"use client";

import { useEffect } from "react";
import { visitApi } from "@/lib/api";

/** 마운트 시 방문 1회 기록(같은 기기 중복 방지). 화면에는 아무것도 렌더하지 않음. */
export function VisitTracker() {
  useEffect(() => {
    visitApi.track().catch(() => {
      /* 집계 실패는 무시(사용자 경험에 영향 없음) */
    });
  }, []);
  return null;
}
