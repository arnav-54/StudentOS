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
          primary: "#7C3AED",  // Electric Neon Purple/Violet
          accent: "#10B981",   // Cyber Emerald Accent
          violet: "#8B5CF6",   // Vibrant Sparkle AI
          cyberPink: "#EC4899", // Neon Cyber Pink
          success: "#10B981",
          danger: "#EF4444",
          warning: "#F59E0B",
        },
        bg: {
          light: "#F8FAFC",
          dark: "#030303",     // Sleek Void Black
          cardLight: "#FFFFFF",
          cardDark: "#0B0B0F", // Deep Space card
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 12px 40px rgba(124, 58, 237, 0.15)',
        'neon-violet': '0 0 20px rgba(124, 58, 237, 0.25)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.25)',
      }
    },
  },
  plugins: [],
}
