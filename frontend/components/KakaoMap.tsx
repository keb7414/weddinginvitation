"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/lib/data";

declare global {
  interface Window {
    // 카카오 지도 SDK
    kakao: any;
  }
}

const KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

export function KakaoMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!KEY || !ref.current) return;

    const init = () => {
      window.kakao.maps.load(() => {
        const { venue } = wedding;
        const draw = (lat: number, lng: number) => {
          if (!ref.current) return;
          const pos = new window.kakao.maps.LatLng(lat, lng);
          const map = new window.kakao.maps.Map(ref.current, {
            center: pos,
            level: 4,
            draggable: true,
          });
          new window.kakao.maps.Marker({ map, position: pos });
        };

        // 주소 → 좌표 변환(지오코딩). 실패 시 data.ts 의 좌표로 폴백.
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(venue.address, (result: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            draw(Number(result[0].y), Number(result[0].x));
          } else {
            draw(venue.lat, venue.lng);
          }
        });
      });
    };

    // SDK 로드(1회). services 라이브러리로 지오코딩 사용.
    if (window.kakao && window.kakao.maps) {
      init();
      return;
    }
    const existing = document.getElementById("kakao-map-sdk") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services`;
    script.addEventListener("load", init);
    document.head.appendChild(script);
  }, []);

  if (!KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
        지도 (Kakao 키 미설정)
      </div>
    );
  }

  return <div ref={ref} className="h-full w-full" />;
}
