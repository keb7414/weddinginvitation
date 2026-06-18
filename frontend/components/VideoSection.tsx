import { Section, SectionTitle } from "./Section";

export function VideoSection() {
  return (
    <Section className="bg-ivory text-center">
      <SectionTitle en="Movie" ko="영상" />
      {/* 실제 영상 임베드 시 iframe(src=YouTube/Vimeo) 로 교체 */}
      <div className="mx-auto flex aspect-video w-full max-w-[360px] items-center justify-center rounded-xl bg-sand text-sm text-muted">
        영상 자리 (추후 임베드)
      </div>
    </Section>
  );
}
