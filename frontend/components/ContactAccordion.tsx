"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

function ContactRow({ label, name, phone }: { label: string; name: string; phone: string }) {
  return (
    <div className="flex items-center justify-between border-b border-sand py-3 text-sm">
      <span className="text-muted">
        {label} <span className="ml-2 text-ink">{name}</span>
      </span>
      <span className="flex gap-2">
        <a
          href={`tel:${phone}`}
          aria-label="전화"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-point/10 text-point"
        >
          ☎
        </a>
        <a
          href={`sms:${phone}`}
          aria-label="문자"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-point/10 text-point"
        >
          ✉
        </a>
      </span>
    </div>
  );
}

export function ContactAccordion() {
  const [open, setOpen] = useState(false);
  const { contacts } = wedding;

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Contact" ko="연락하기" />
      <button
        onClick={() => setOpen((v) => !v)}
        className="mx-auto block rounded-full border border-point/40 px-6 py-2 text-sm text-point"
      >
        연락처 {open ? "닫기" : "보기"}
      </button>
      {open && (
        <div className="mx-auto mt-6 max-w-[320px] animate-fadeUp">
          {[...contacts.groom, ...contacts.bride].map((c) => (
            <ContactRow key={c.label} label={c.label} name={c.name} phone={c.phone} />
          ))}
        </div>
      )}
    </Section>
  );
}
