import type { Metadata, Viewport } from "next";
import { Parisienne } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { wedding } from "@/lib/data";

// 한글 본문 — 리디바탕(self-host)
const serif = localFont({
  src: "./fonts/RIDIBatang.woff2",
  variable: "--font-serif",
  display: "swap",
});

// 영어 타이틀용 필기체(캘리그래피)
const script = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

// 오프닝 손글씨 — 더페이스샵 잉크립퀴드체(self-host)
const hand = localFont({
  src: "./fonts/InkLipquid.woff2",
  variable: "--font-hand",
  display: "swap",
});

const title = `모바일 청첩장 | ${wedding.groom.name}♥${wedding.bride.name} 결혼합니다`;
const description = `${wedding.date.year}.${wedding.date.month}.${wedding.date.day} ${wedding.date.weekday} ${wedding.date.timeText} · ${wedding.venue.name}`;

const SITE_URL = "https://invitation-eb-sc.vercel.app/";

export const metadata: Metadata = {
  title,
  description,
  // 모바일 브라우저가 버스 번호 등을 전화번호로 자동 인식(밑줄 링크)하는 것 방지.
  // 명시적 <a href="tel:..."> (예식장 번호)는 그대로 동작함.
  formatDetection: { telephone: false, date: false, email: false, address: false },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    images: [
      {
        url: SITE_URL + "images/og.jpg?v=2",
        width: 1200,
        height: 628,
        alt: title,
      },
    ],
  },
};

// 모바일 최적화 — 기기 폭에 맞춰 렌더, 핀치줌 방지(앱 같은 느낌), 노치 영역까지 채움
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#faf8f4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${serif.variable} ${script.variable} ${hand.variable}`}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
