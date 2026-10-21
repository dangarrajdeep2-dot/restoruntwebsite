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
        forest: {
          DEFAULT: '#0E2A1F',
          50: '#F2F7F4',
          100: '#E1ECE6',
          200: '#C1D8CC',
          300: '#95BEAB',
          400: '#649E85',
          500: '#3D7E63',
          600: '#27624B',
          700: '#1A4A38',
          800: '#14382A',
          900: '#0E2A1F',
          950: '#071711',
        },
        gold: {
          DEFAULT: '#D4A24C',
          50: '#FDF9F0',
          100: '#FAF2DD',
          200: '#F4E3BA',
          300: '#ECD091',
          400: '#E2BA67',
          500: '#D4A24C',
          600: '#B88236',
          700: '#94612A',
          800: '#794D27',
          900: '#654024',
          950: '#392111',
        },
        cream: {
          DEFAULT: '#FFF6E5',
          50: '#FFFFFF',
          100: '#FFFDF9',
          200: '#FFF6E5',
          300: '#FCECCC',
          400: '#F7DBA3',
          500: '#ECC676',
        },
        saffron: {
          DEFAULT: '#E8782A',
          50: '#FEF6EE',
          100: '#FCEAD9',
          200: '#F8D1B1',
          300: '#F3B282',
          400: '#ED8B4E',
          500: '#E8782A',
          600: '#CC5B1B',
          700: '#A94317',
          800: '#87361A',
          950: '#491A0A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3C77C 0%, #D4A24C 50%, #94612A 100%)',
        'forest-gradient': 'linear-gradient(180deg, #071711 0%, #0E2A1F 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
