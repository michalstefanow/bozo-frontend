import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        pangolin: [`var(--font-pangolin)`, "cursive"],
      },
      keyframes: {
        blink: {
          "0%, 25%": { transform: "scale(0.8)", opacity: "0" },
          "25%, 50%": { transform: "scale(1.3)", opacity: "1" },
          "50%, 75%": { transform: "scale(1.3)", opacity: "1" },
          "75%, 100%": { transform: "scale(0.8)", opacity: "0" },
        },
        rotate: {
          "0%, 25%": { transform: "rotate(45deg) scale(1);" },
          "25%, 50%": { transform: "rotate(-45deg) scale(0.8)" },
          "50%, 75%": { transform: "rotate(-45deg) scale(0.8)" },
          "75%, 100%": { transform: "rotate(45deg) scale(1)" },
        },
      },
      animation: {
        blink: "blink 4s cubic-bezier(0, 0, 0.3, 1) infinite",
        rotate: "rotate 2s cubic-bezier(0, 0, 0.3, 1) infinite",
        "rotate-once": "rotate 2s cubic-bezier(0, 0, 0.3, 1)",
      },
      backgroundSize: {
        stretch: "100% 100%",
      },
    },
  },
  plugins: [],
};
export default config;
