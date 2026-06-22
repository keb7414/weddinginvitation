import { Section } from "./Section";
import { wedding } from "@/lib/data";

export function Invitation() {
  const { greeting } = wedding;
  return (
    <Section className="bg-ivory text-center !pt-2 !pb-10">
      <p className="text-sm italic leading-7 text-point">
        &ldquo;{greeting.verse}&rdquo;
      </p>
      <p className="mb-5 mt-1 text-xs text-point/80">{greeting.verseRef}</p>
      <div className="space-y-1 text-[15px] leading-6 text-ink/90">
        {greeting.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </Section>
  );
}
