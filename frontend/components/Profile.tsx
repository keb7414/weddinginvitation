import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

function ProfileCard({ tone, label, name }: { tone: string; label: string; name: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`flex h-28 w-28 items-center justify-center rounded-full ${tone} text-xs text-muted`}>
        사진
      </div>
      <p className="mt-3 text-xs text-point">{label}</p>
      <p className="text-sm font-bold text-ink">{name}</p>
    </div>
  );
}

export function Profile() {
  const { groom, bride } = wedding;
  return (
    <Section className="bg-ivory">
      <SectionTitle en="Profile" ko="신랑 · 신부" />
      <div className="flex justify-center gap-10">
        <ProfileCard tone="bg-sand" label="신랑" name={groom.name} />
        <ProfileCard tone="bg-point/15" label="신부" name={bride.name} />
      </div>
    </Section>
  );
}
