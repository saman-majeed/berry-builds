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
        bg: '#08080e',
        surface: '#101018',
        surface2: '#15151f',
        surface3: '#1a1a27',
        border: '#1e1e30',
        border2: '#252538',
        accent: '#6d28d9',
        accent2: '#8b5cf6',
        accent3: '#a78bfa',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
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
