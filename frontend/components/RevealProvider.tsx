"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RevealProvider({ children }: { children: ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
