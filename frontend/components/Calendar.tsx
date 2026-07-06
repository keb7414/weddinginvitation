"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
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

  // D-day 계산 — 예식일 자정과 오늘 자정의 날짜 차이(시각/올림 영향 없음)
  const [dday, setDday] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDday(Math.round((target.getTime() - today.getTime()) / 86400000));
  }, [year, month, day]);

  return (
    <Section className="bg-ivory text-center">
      <p className="font-script text-2xl leading-none text-point">Calendar</p>
      <p className="mt-4 text-xl tracking-wide text-ink">{month}월</p>

      <div className="mx-auto mt-7 max-w-[330px] border-y border-sand py-6">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 text-xs">
          {WEEK.map((w, i) => (
            <span key={w} className={i === 0 ? "text-point" : "text-muted"}>
              {w}
            </span>
          ))}
        </div>
        {/* 날짜 */}
        <div className="mt-3 grid grid-cols-7 gap-y-3 text-sm">
          {cells.map((c, i) => {
            if (c === null) return <span key={i} />;
            const isWedding = c === day;
            const isSunday = i % 7 === 0;
            return (
              <span key={i} className="flex justify-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isWedding
                      ? "bg-point font-medium text-white"
                      : isSunday
                        ? "text-point"
                        : "text-ink/80"
                  }`}
                >
                  {c}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {dday !== null && (
        <p className="mt-7 text-sm text-ink">
          {wedding.groom.name} <span className="text-point">♥</span> {wedding.bride.name}{" "}
          {dday > 0 ? (
            <>
              예식일까지, <span className="font-medium text-point">D-{dday}</span>
            </>
          ) : dday === 0 ? (
            <span className="font-medium text-point">예식일이 오늘입니다.</span>
          ) : (
            <span className="text-muted">결혼을 축하합니다</span>
          )}
        </p>
      )}
    </Section>
  );
}
