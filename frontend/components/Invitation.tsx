import { Section } from "./Section";
import { wedding } from "@/lib/data";

export function Invitation() {
  const { greeting } = wedding;
  return (
    <Section className="bg-ivory text-center !pt-6 !pb-12">
      <p className="text-sm italic leading-7 text-point">
        {greeting.verse.map((line, i) => (
          <span key={i}>
            {i === 0 ? "“" : null}
            {line}
            {i === greeting.verse.length - 1 ? "”" : null}
            {i < greeting.verse.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
      <p className="mb-7 mt-2 text-xs text-point/80">{greeting.verseRef}</p>
      <div className="space-y-2.5 text-[15px] leading-7 text-[#5c4632]">
        {greeting.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </Section>
  );
}
