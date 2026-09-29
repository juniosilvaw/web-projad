/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2333",
        canvas: "#F7F5F0",
        primary: {
          DEFAULT: "#1E3A5F",
          dark: "#142943",
          light: "#2E5280",
        },
        accent: {
          DEFAULT: "#B8862E",
          soft: "#E8D9B5",
          dark: "#8C6521",
        },
        line: "#DED6C3",
        muted: "#6B6459",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Work Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
