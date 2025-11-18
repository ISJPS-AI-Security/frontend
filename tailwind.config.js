/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // USER theme
        user: {
          light: "#CFE9FF",
          DEFAULT: "#1D4ED8",
          dark: "#0F172A",
        },
        // MANAGER theme
        manager: {
          light: "#D1FADF",
          DEFAULT: "#16A34A",
          dark: "#022C22",
        },
        // ADMIN theme
        admin: {
          light: "#FFE1E1",
          DEFAULT: "#DC2626",
          dark: "#240046",
        },
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.1)", // Added soft shadow
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
