import { Section } from "./Section";
import { wedding } from "@/lib/data";

export function FamilyInfo() {
  const { groom, bride } = wedding;
  return (
    <Section className="bg-ivory text-center">
      <div className="space-y-2 text-[15px] leading-8 text-ink/90">
        <p>
          {groom.father} <span className="text-muted">·</span> {groom.mother}
          <span className="mx-2 text-xs text-muted">{groom.role}</span>
          <span className="ml-2 font-medium">{groom.name}</span>
        </p>
        <p>
          {bride.father} <span className="text-muted">·</span> {bride.mother}
          <span className="mx-2 text-xs text-muted">{bride.role}</span>
          <span className="ml-2 font-medium">{bride.name}</span>
        </p>
      </div>
    </Section>
  );
}
