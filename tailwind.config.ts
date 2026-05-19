import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#06060b',
        surface: '#0c0c14',
        surface2: '#12121c',
        surface3: '#181824',
        border: '#232336',
        border2: '#2e2e44',
        accent: '#7c3aed',
        accent2: '#a78bfa',
        accent3: '#c4b5fd',
      },
      animation: {
        'fade-up': 'fadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
