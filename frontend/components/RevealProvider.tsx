"use client";

import { ReactNode, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RevealProvider({ children }: { children: ReactNode }) {
  useScrollReveal();

  // iOS Safari 핀치줌 차단 (viewport meta 를 무시하므로 제스처 이벤트로 막음)
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);
    document.addEventListener("gestureend", prevent);
    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
    };
  }, []);

  return <>{children}</>;
}
