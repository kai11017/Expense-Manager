/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        glassBg: "var(--glass-bg)",
        glassBorder: "var(--glass-border)",
        brandBlue: "var(--accent-blue)",
        brandGreen: "var(--accent-emerald)",
        brandPurple: "var(--accent-purple)",
      }
    },
  },
  plugins: [],
}
