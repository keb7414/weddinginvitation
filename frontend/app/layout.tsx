import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo, Parisienne } from "next/font/google";
import "./globals.css";
import { wedding } from "@/lib/data";

const serif = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
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

const title = `💌모바일 청첩장 | ${wedding.groom.name}ღ${wedding.bride.name}`;
const description = `${wedding.date.year}.${wedding.date.month}.${wedding.date.day} ${wedding.date.weekday} ${wedding.date.timeText} · ${wedding.venue.name}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
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
    <html lang="ko" className={`${serif.variable} ${script.variable}`}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
