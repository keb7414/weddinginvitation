"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

export function Notice() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section className="bg-ivory">
      <SectionTitle en="Notice" ko="공지사항" />
      <ul className="mx-auto max-w-[340px] space-y-3">
        {wedding.notices.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm text-ink"
              >
                <span>{item.title}</span>
                <span className="text-point">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <p className="animate-fadeUp px-5 pb-5 text-sm leading-7 text-ink/80">
                  {item.body}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
