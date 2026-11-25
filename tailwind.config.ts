import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        'bg-pure': '#000000',
        surface: '#161016',
        primary: '#E0119D',
        'primary-bright': '#FF4FC7',
        'primary-soft': 'rgba(224,17,157,0.33)',
        text: '#F5F5F5',
        'text-muted': '#A1A1AA',
        border: '#2A2A2A',
        'seller-bg': '#15040F',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        display: '0.25em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 0 24px rgba(224, 17, 157, 0.25)',
        glow: '0 0 40px rgba(224, 17, 157, 0.35)',
        'glow-lg': '0 16px 60px -12px rgba(224, 17, 157, 0.4)',
        card: '0 24px 60px -24px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
} satisfies Config
