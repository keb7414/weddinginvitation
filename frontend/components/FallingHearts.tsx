import { CSSProperties } from "react";

// 하트 흩날림 — 결정적(deterministic) 설정으로 SSR/CSR 하이드레이션 불일치 방지
const HEARTS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100, // 가로 분포(%) — 사선 낙하라 시작은 왼쪽 위주
  size: 7 + (i % 4) * 3, // 7~16px (작게)
  dur: 12 + (i % 7), // 12~18s (느리게)
  delay: (i % 9) * 0.8, // 0~6.4s 시차
  op: 0.25 + (i % 4) * 0.1, // 0.25~0.55 (뿌옇게)
}));

/** 부모(relative) 영역 위에 하트가 떨어지는 오버레이. 클릭 방해 없음. */
export function FallingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" aria-hidden>
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="heart text-white"
          style={
            {
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
              "--heart-op": h.op,
            } as CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </div>
  );
}
