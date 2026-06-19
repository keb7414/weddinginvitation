import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 차분한 웨딩 톤
        ivory: "#faf8f4",
        sand: "#efe9e1",
        ink: "#3a3631",
        muted: "#8a8377",
        point: "#a98b6f", // 포인트(베이지 골드)
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // 커버 사진: 살짝 확대된 상태에서 서서히 제자리로 + 페이드인
        coverReveal: {
          "0%": { opacity: "0", transform: "scale(1.12)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // 진입 후 아주 느린 줌(켄번스) — 정적 사진에 생동감
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.06)" },
        },
        // 글자 페이드업(인트로용)
        introUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out forwards",
        coverReveal: "coverReveal 1.8s cubic-bezier(0.22,1,0.36,1) forwards",
        kenBurns: "kenBurns 12s ease-out 1.8s forwards",
        introUp: "introUp 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
