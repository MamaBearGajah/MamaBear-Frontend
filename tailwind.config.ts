import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mama: {
          primary: "#D85B88",
          "primary-dark": "#C54F7A",
          soft: "#FFF6F9",
          surface: "#FFFFFF",
          border: "#F3D9E3",
          brown: "#6B4637",
          muted: "#9A7B6D",
          topbar: "#7A503F",
          danger: "#E35D6A",
          success: "#44B68B",
          warning: "#F0B54A",
        },
      },
      borderRadius: {
        pill: "9999px",
        card: "24px",
        modal: "28px",
      },
      boxShadow: {
        mama: "0 10px 30px rgba(216, 91, 136, 0.08)",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;