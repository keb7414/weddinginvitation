// 청첩장 더미 콘텐츠 — 실제 정보 확정 시 이 파일만 교체하면 됩니다.

export const wedding = {
  groom: {
    name: "정승찬",
    role: "아들",
    father: "정○○",
    mother: "○○○",
    phone: "010-0000-0001",
  },
  bride: {
    name: "김은별",
    role: "딸",
    father: "김○○",
    mother: "○○○",
    phone: "010-0000-0002",
  },
  date: {
    iso: "2026-10-31T13:00:00+09:00",
    year: 2026,
    month: 10,
    day: 31,
    weekday: "토요일",
    timeText: "오후 1시",
  },
  venue: {
    name: "경향교회",
    hall: "본당 2층",
    address: "서울특별시 ○○구 ○○로 00",
    lat: 37.5665,
    lng: 126.978,
    tel: "02-000-0000",
  },
  greeting: {
    verse: "사랑은 오래 참고 사랑은 온유하며",
    body: [
      "서로 다른 길을 걸어온 두 사람이",
      "이제 같은 곳을 바라보며 한 길을 걷고자 합니다.",
      "귀한 걸음으로 축복해 주시면 더없는 기쁨으로 간직하겠습니다.",
    ],
  },
  // 계좌 (더미)
  accounts: {
    groom: [
      { label: "신랑", bank: "○○은행", number: "000-0000-0000", holder: "정승찬" },
      { label: "신랑 아버지", bank: "○○은행", number: "000-0000-0001", holder: "정○○" },
    ],
    bride: [
      { label: "신부", bank: "○○은행", number: "000-0000-0002", holder: "김은별" },
      { label: "신부 어머니", bank: "○○은행", number: "000-0000-0003", holder: "○○○" },
    ],
  },
  // 갤러리 — 실제 이미지 없이 플레이스홀더 색상 블록 사용 (개수만 정의)
  galleryCount: 9,
  notices: [
    {
      title: "화환 안내",
      body: "화환은 정중히 사양합니다. 따뜻한 마음만 감사히 받겠습니다.",
    },
    {
      title: "주차 안내",
      body: "예식장 지하 주차장 2시간 무료입니다. 혼잡이 예상되니 대중교통을 권장합니다.",
    },
  ],
  transport: [
    { type: "지하철", desc: "○○역 0번 출구에서 도보 5분" },
    { type: "버스", desc: "○○정류장 하차 (간선 000, 지선 0000)" },
    { type: "자가용", desc: "내비게이션에 '경향교회' 검색" },
  ],
  interview: [
    {
      q: "서로의 첫인상은 어땠나요?",
      a: "따뜻하고 편안한 사람이라는 느낌이었어요. (더미 답변)",
    },
    {
      q: "결혼을 결심한 순간은?",
      a: "함께한 시간이 늘수록 평생 함께하고 싶다는 확신이 들었어요. (더미 답변)",
    },
  ],
};

export type Account = {
  label: string;
  bank: string;
  number: string;
  holder: string;
};
