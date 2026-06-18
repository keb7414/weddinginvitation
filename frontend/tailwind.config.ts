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
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
