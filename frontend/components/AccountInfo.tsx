"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding, type Account } from "@/lib/data";

function AccountRow({ acc }: { acc: Account }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(acc.number);
    } catch {
      /* clipboard 미지원 무시 */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between border-b border-sand py-2.5 last:border-0">
      <div className="text-sm">
        <p className="text-point">
          {acc.bank} {acc.number}
        </p>
        <p className="mt-1 text-ink">{acc.holder}</p>
      </div>
      <button
        onClick={copy}
        className="rounded border border-sand px-3 py-1.5 text-xs text-ink"
      >
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

function AccountPanel({
  title,
  accounts,
  open,
  onToggle,
}: {
  title: string;
  accounts: Account[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-point/20">
      <button
        onClick={onToggle}
        className="relative flex w-full items-center justify-center bg-[#f5e6df] py-3 text-sm text-point"
      >
        {title}
        <span className="absolute right-5 text-point/70">{open ? "▾" : "▴"}</span>
      </button>
      {open && (
        <div className="bg-white px-5">
          {accounts.map((acc) => (
            <AccountRow key={acc.number + acc.holder} acc={acc} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountInfo() {
  const [open, setOpen] = useState({ groom: false, bride: false });
  const { accounts } = wedding;

  const toggle = (side: "groom" | "bride") =>
    setOpen((cur) => ({ ...cur, [side]: !cur[side] }));

  return (
    <Section className="bg-ivory !px-4">
      <SectionTitle ko="마음을 전하는 곳" soft />
      <p className="mb-6 text-center text-[13px] leading-7 text-ink/80">
        멀리서나마 축하의 마음을 전하고자 하시는 분들을 위해
        <br />
        아래와 같이 안내해 드립니다.
        <br />
        보내주신 따뜻한 마음 잊지 않고 예쁘게 살겠습니다.
      </p>

      <div className="space-y-3">
        <AccountPanel
          title="신랑측 계좌번호"
          accounts={accounts.groom}
          open={open.groom}
          onToggle={() => toggle("groom")}
        />
        <AccountPanel
          title="신부측 계좌번호"
          accounts={accounts.bride}
          open={open.bride}
          onToggle={() => toggle("bride")}
        />
      </div>
    </Section>
  );
}
