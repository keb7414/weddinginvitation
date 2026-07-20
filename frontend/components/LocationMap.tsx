import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";
import { KakaoMap } from "./KakaoMap";

function SubwayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5V21h2l2-2h4l2 2h2v-.5L18.5 19A3.5 3.5 0 0 0 20 15.5V6c0-3.5-4-4-8-4zM7.5 17A1.5 1.5 0 1 1 9 15.5 1.5 1.5 0 0 1 7.5 17zM11 11H6V6h5zm2 0V6h5v5zm3.5 6a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16.5 17z" />
    </svg>
  );
}
function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M5 3c-2 0-3 .5-3 3v9a2 2 0 0 0 1 1.7V18a1 1 0 0 0 2 0v-1h10v1a1 1 0 0 0 2 0v-1.3A2 2 0 0 0 18 15V6c0-2.5-1-3-3-3zm0 3h10v4H5zm1.5 10A1.5 1.5 0 1 1 8 14.5 1.5 1.5 0 0 1 6.5 16zm7 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V17a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4.5A1.5 1.5 0 0 1 4.5 11zm1.7-1h10.6l-1-3H8.2zM6.5 15A1.5 1.5 0 1 0 5 13.5 1.5 1.5 0 0 0 6.5 15zm11 0A1.5 1.5 0 1 0 16 13.5 1.5 1.5 0 0 0 17.5 15z" />
    </svg>
  );
}

function TransportBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 border-b border-sand pb-3 text-point">
        <span>{icon}</span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-[13px] leading-6 text-ink/80">{children}</div>
    </div>
  );
}

export function LocationMap() {
  const { venue, transport } = wedding;
  // 지도 조회는 장소명이 아니라 '주소' 기준
  const addrQuery = encodeURIComponent(venue.address);
  // 카카오: link/map 형식({표시명},{위도},{경도}) → 지도 상세뷰로 바로 열림
  const kakaoMapUrl = `https://map.kakao.com/link/map/${addrQuery},${venue.lat},${venue.lng}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${addrQuery}`;

  return (
    <Section className="bg-ivory">
      <SectionTitle ko="오시는 길" soft />

      <div className="text-center">
        <p className="text-lg text-ink">{venue.name}</p>
        <p className="mt-1.5 text-sm text-point">{venue.address}</p>
        <p className="mt-0.5 text-sm text-muted">{venue.hall}</p>
        <a href="tel:02-3663-0333" className="mt-1 inline-block text-sm text-point">
          02-3663-0333
        </a>
      </div>

      {/* 카카오 지도 */}
      <div className="mt-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand">
        <KakaoMap />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-point/10 px-4 py-2 text-xs text-point"
        >
          카카오맵
        </a>
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-point/10 px-4 py-2 text-xs text-point"
        >
          네이버지도
        </a>
      </div>

      <div className="mt-8 space-y-6">
        {/* 지하철 */}
        <TransportBlock icon={<SubwayIcon />} title="지하철">
          {transport.subway}
        </TransportBlock>

        {/* 버스 */}
        <TransportBlock icon={<BusIcon />} title="버스">
          <p className="mb-3">{transport.busStops}</p>
          <div className="space-y-1">
            {transport.busRoutes.map((b) => (
              <p key={b.kind}>
                <span className="mr-2 text-point">{b.kind}</span>
                {b.list}
              </p>
            ))}
          </div>
        </TransportBlock>

        {/* 자차 */}
        <TransportBlock icon={<CarIcon />} title="자차">
          {transport.car.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </TransportBlock>
      </div>
    </Section>
  );
}
