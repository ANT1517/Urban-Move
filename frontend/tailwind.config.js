/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3A6B",
        accent: "#F97316",
        surface: "#F8FAFC",
        "primary-dark": "#12284b",
        border: "#e2e8f0",
        "text-muted": "#64748b",
        error: "#ef4444",
      }
    },
  },
  plugins: [],
}

