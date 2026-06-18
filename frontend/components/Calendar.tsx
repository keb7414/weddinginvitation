"use client";

import { useEffect, useState } from "react";
import { Section, SectionTitle } from "./Section";
import { wedding } from "@/lib/data";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export function Calendar() {
  const { year, month, day } = wedding.date;
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // D-day 계산
  const [dday, setDday] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(wedding.date.iso).getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDday(Math.ceil((target - today.getTime()) / 86400000));
  }, []);

  return (
    <Section className="bg-ivory text-center">
      <SectionTitle en="Calendar" ko="예식 일자" />
      <p className="mb-6 text-sm text-muted">
        {year}년 {month}월 {day}일 {wedding.date.weekday} {wedding.date.timeText}
      </p>

      <div className="mx-auto max-w-[320px] rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-7 gap-y-2 text-xs">
          {WEEK.map((w, i) => (
            <span
              key={w}
              className={i === 0 ? "text-point" : "text-muted"}
            >
              {w}
            </span>
          ))}
          {cells.map((c, i) => {
            const isWedding = c === day;
            return (
              <span
                key={i}
                className={`mx-auto flex h-8 w-8 items-center justify-center text-sm ${
                  isWedding
                    ? "rounded-full bg-point font-bold text-white"
                    : "text-ink/80"
                }`}
              >
                {c ?? ""}
              </span>
            );
          })}
        </div>
      </div>

      {dday !== null && (
        <p className="mt-6 text-sm text-ink">
          {wedding.groom.name} ♥ {wedding.bride.name} 결혼식{" "}
          {dday > 0 ? (
            <span className="font-bold text-point">D-{dday}</span>
          ) : dday === 0 ? (
            <span className="font-bold text-point">D-DAY</span>
          ) : (
            <span className="text-muted">결혼을 축하합니다</span>
          )}
        </p>
      )}
    </Section>
  );
}
