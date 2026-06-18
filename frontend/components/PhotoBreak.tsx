import { Section } from "./Section";
import { asset } from "@/lib/asset";

/** 커버 바로 아래 전체 폭 사진 (snd.jpg) */
export function PhotoBreak() {
  return (
    <Section className="bg-ivory">
      <div className="overflow-hidden rounded-2xl shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/images/snd.jpg")}
          alt="신랑 신부 사진"
          className="w-full object-cover"
        />
      </div>
    </Section>
  );
}
