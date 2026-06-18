import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

export function LocationMap() {
  const { venue, transport } = wedding;
  const mapQuery = encodeURIComponent(venue.name);

  return (
    <Section className="bg-ivory">
      <SectionTitle en="Location" ko="오시는 길" />

      <div className="text-center text-sm text-ink">
        <p className="font-bold">{venue.name}</p>
        <p className="mt-1 text-muted">
          {venue.hall} · {venue.tel}
        </p>
        <p className="mt-1 text-muted">{venue.address}</p>
      </div>

      {/* 카카오맵 SDK 연동 전 플레이스홀더 + 길찾기 링크 */}
      <div className="mt-5 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-sand text-sm text-muted">
        지도 (Kakao Map 연동 예정)
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <a
          href={`https://map.kakao.com/?q=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-point/10 px-4 py-2 text-xs text-point"
        >
          카카오맵
        </a>
        <a
          href={`https://map.naver.com/v5/search/${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-point/10 px-4 py-2 text-xs text-point"
        >
          네이버지도
        </a>
      </div>

      <ul className="mt-8 space-y-4">
        {transport.map((t) => (
          <li key={t.type} className="flex gap-3 text-sm">
            <span className="shrink-0 font-bold text-point">{t.type}</span>
            <span className="text-ink/80">{t.desc}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
