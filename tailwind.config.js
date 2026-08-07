/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "Inter", "sans-serif"],
        pacifico: ["Pacifico", "cursive"],
        welth: ["WelthCatritz", "sans-serif"],
      },
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e4e8ff',
          200: '#cbd4ff',
          300: '#a3b4ff',
          400: '#758aff',
          500: '#4059f1',
          600: '#2b3df0',
          700: '#202ce0',
          800: '#1b25b5',
          900: '#1c248e',
          DEFAULT: '#4059F1',
        },
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
