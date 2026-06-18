import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

export function Invitation() {
  const { greeting } = wedding;
  return (
    <Section className="bg-ivory text-center">
      <SectionTitle en="Invitation" ko="초대합니다" />
      <p className="mb-8 text-sm italic leading-7 text-point">{greeting.verse}</p>
      <div className="space-y-3 text-[15px] leading-8 text-ink/90">
        {greeting.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </Section>
  );
}
