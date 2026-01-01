/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006837",
        secondary: "#2e3192",
        accent: "#fbb03b",
      },
    },
  },
  plugins: [],
}

