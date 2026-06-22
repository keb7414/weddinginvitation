// 청첩장 콘텐츠 — feelcard 원본(정승찬♥김은별)에 맞춰 구성.
// 실제 연락처/계좌 등 일부는 원본의 표시값/플레이스홀더를 따른다.

export const wedding = {
  groom: {
    name: "정승찬",
    role: "차남",
    father: "정병록",
    mother: "조홍랑",
    phone: "010-0000-0001",
  },
  bride: {
    name: "김은별",
    role: "장녀",
    father: "김영동",
    mother: "이영주",
    phone: "010-3439-2329",
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
    hall: "비전홀",
    address: "서울 강서구 화곡로 375",
    lat: 37.5665,
    lng: 126.978,
    tel: "",
  },
  greeting: {
    verse: "그 둘이 한 몸이 될지니라 이러므로 이제 둘이 아니요 한 몸이니",
    verseRef: "(마가복음 10:8)",
    body: [
      "하나님의 사랑으로 만난 두 사람이",
      "새로운 가정을 이루는 약속을 하려 합니다.",
      "서로의 부족한 반을 채워 주어",
      "하나의 가정을 이루는 혼인잔치에",
      "귀한 걸음으로 빛내주시기 바랍니다.",
    ],
  },
  // 연락하기 — 신랑/신부 + 양가 부모 (원본 동일 구성)
  contacts: {
    groom: [
      { label: "신랑", name: "정승찬", phone: "010-4916-4036" },
      { label: "신랑 아버지", name: "정병록", phone: "010-0000-0003" },
      { label: "신랑 어머니", name: "조홍랑", phone: "010-0000-0004" },
    ],
    bride: [
      { label: "신부", name: "김은별", phone: "010-3439-2329" },
      { label: "신부 아버지", name: "김영동", phone: "010-7236-0121" },
      { label: "신부 어머니", name: "이영주", phone: "010-2340-2329" },
    ],
  },
  // 마음 전하는 곳 — 원본 표시값(샘플 계좌)
  accounts: {
    groom: [
      { label: "신랑", bank: "기업", number: "218-071682-01-019", holder: "정승찬" },
      { label: "신랑 아버지", bank: "국민", number: "776202-04-082169", holder: "정병록" },
      { label: "신랑 어머니", bank: "국민", number: "409102-94-107541", holder: "조홍랑" },
    ],
    bride: [
      { label: "신부", bank: "우리", number: "1002-360-632713", holder: "김은별" },
      { label: "신부 아버지", bank: "우리", number: "1002-345-678901", holder: "김영동" },
      { label: "신부 어머니", bank: "하나", number: "123-456789-01234", holder: "이영주" },
    ],
  },
  galleryCount: 18,
  notices: [
    {
      title: "주차 안내",
      body: "건물 내 지하주차장 이용 가능하며 3시간 무료입니다.",
    },
  ],
  transport: {
    subway: "9호선 가양역 8번 출구 > 마포중,고등학교 방면으로 도보 5분",
    busStops: "KBS스포츠월드 / 경복비즈니스고등학교 / 강서구청사거리 / 서울디지털대학교",
    busRoutes: [
      { kind: "간선", list: "601 604 605 606 650 652 654 661 673 N26(심야)" },
      { kind: "지선", list: "5712 6514 6627 6629 6633 6642 6645 6715" },
      { kind: "공항", list: "6003 6018" },
      { kind: "일반", list: "60 60-3 70-2 70-3" },
      { kind: "마을", list: "강서04 강서05" },
    ],
    car: ["건물 내 지하주차장 이용", "3시간 무료 이용 가능"],
  },
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
