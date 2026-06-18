import type { Metadata } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import { wedding } from "@/lib/data";

const serif = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const title = `${wedding.groom.name} ♥ ${wedding.bride.name} 결혼합니다`;
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={serif.variable}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
