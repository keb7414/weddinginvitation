import { Section, SectionTitle } from "./Section";

export function FlowerOrder() {
  return (
    <Section className="bg-ivory text-center">
      <SectionTitle en="Flower" ko="화환 보내기" />
      <p className="mb-6 text-sm leading-7 text-ink/80">
        축하 화환으로 마음을 전하고 싶으시다면
        <br />
        아래 버튼으로 예약하실 수 있습니다.
      </p>
      {/* 실제 화환 예약 외부 링크로 교체 */}
      <button
        type="button"
        className="rounded-full border border-point/40 px-7 py-2.5 text-sm text-point"
      >
        화환 예약하기
      </button>
    </Section>
  );
}
