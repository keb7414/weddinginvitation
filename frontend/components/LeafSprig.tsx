/**
 * 장식용 잎 가지 (직접 그린 오리지널 SVG). 색은 부모의 text 색(currentColor)을 따른다.
 */
export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 96"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* 줄기 */}
      <path
        d="M40 88 C 40 64 40 40 41 20"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <g fill="currentColor" opacity="0.9">
        {/* 끝 잎 */}
        <ellipse cx="41" cy="15" rx="2.6" ry="8" />
        {/* 오른쪽 잎들 (위→아래로 커짐) */}
        <g transform="rotate(34 45 26)">
          <ellipse cx="45" cy="26" rx="2.6" ry="7.5" />
        </g>
        <g transform="rotate(34 46 42)">
          <ellipse cx="46" cy="42" rx="2.9" ry="8.5" />
        </g>
        <g transform="rotate(34 46 58)">
          <ellipse cx="46" cy="58" rx="3" ry="9" />
        </g>
        {/* 왼쪽 잎들 */}
        <g transform="rotate(-34 35 34)">
          <ellipse cx="35" cy="34" rx="2.6" ry="7.5" />
        </g>
        <g transform="rotate(-34 34 50)">
          <ellipse cx="34" cy="50" rx="2.9" ry="8.5" />
        </g>
        <g transform="rotate(-34 34 66)">
          <ellipse cx="34" cy="66" rx="3" ry="9" />
        </g>
      </g>
    </svg>
  );
}
