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
        sans: ['Poppins', 'Manrope', 'system-ui', 'sans-serif'],
        dmsans: ['"DM Sans"', 'sans-serif'],
        welth: ['WelthCatritz', 'Welth Catritz', 'serif'],
        editorial: ['WelthCatritz', 'Welth Catritz', 'serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
      },
      colors: {
        miiles: {
          blue: "#4059F1",
          "blue-light": "#E8ECFE",
          pink: "#FCB5B9",
          "pink-light": "#FEEDED",
          gray: {
            50: "#F7F7F8",
            100: "#EEEFF2",
            200: "#D9DBE3",
            400: "#9499AE",
            600: "#4B4F63",
            800: "#1C1E2A",
          }
        },
      },
      boxShadow: {
        sm: "8px 6px 30px 0px rgba(24, 2, 56, 0.02)",
        md: "0px 100px 170px 0px rgba(39, 39, 62, 0.04)",
      },
    },
  },
  plugins: [],
}
