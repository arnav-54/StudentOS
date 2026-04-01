/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#008767", // Emerald/Teal brand color from screenshot
          accent: "#0D9488",  // Clean teal accent
          success: "#10B981", // Success green
          danger: "#EF4444",  // Danger red
          warning: "#F59E0B", // Warning yellow
        },
        bg: {
          light: "#F8FAFC",  // Clean off-white background
          dark: "#09090B",   // Neutral dark mode background
          cardLight: "#FFFFFF",
          cardDark: "#18181B",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 12px 40px rgba(79, 70, 229, 0.1)',
      }
    },
  },
  plugins: [],
}
