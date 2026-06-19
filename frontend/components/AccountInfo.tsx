"use client";

import { useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding, type Account } from "@/lib/data";

function AccountList({ accounts }: { accounts: Account[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (acc: Account) => {
    const text = `${acc.bank} ${acc.number}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard 미지원 환경 무시 */
    }
    setCopied(acc.number);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ul className="space-y-2">
      {accounts.map((acc) => (
        <li
          key={acc.number}
          className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm shadow-sm"
        >
          <div>
            <p className="text-xs text-muted">
              {acc.label} · {acc.holder}
            </p>
            <p className="text-ink">
              {acc.bank} {acc.number}
            </p>
          </div>
          <button
            onClick={() => copy(acc)}
            className="rounded-full bg-point/10 px-3 py-1.5 text-xs text-point"
          >
            {copied === acc.number ? "복사됨" : "복사"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function AccountInfo() {
  const [tab, setTab] = useState<"groom" | "bride">("groom");
  const { accounts } = wedding;

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Gift" ko="마음을 전하는 곳" />
      <p className="mb-6 text-center text-sm leading-7 text-ink/80">
        저희 두 사람의 앞날을 축복해 주시는
        <br />
        모든 분께 진심으로 감사드립니다. 
        <br />
        멀리서나마 축하의 마음을 전하고자 하시는 분들을 위해
        <br />
        아래와 같이 안내해 드립니다. 
        <br />
        보내주신 따뜻한 마음 잊지 않고 예쁘게 살겠습니다.
      </p>

      <div className="mx-auto mb-5 flex max-w-[320px] overflow-hidden rounded-full border border-point/30">
        {(["groom", "bride"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm ${
              tab === t ? "bg-point text-white" : "text-point"
            }`}
          >
            {t === "groom" ? "신랑측" : "신부측"}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-[320px]">
        <AccountList accounts={accounts[tab]} />
      </div>
    </Section>
  );
}
