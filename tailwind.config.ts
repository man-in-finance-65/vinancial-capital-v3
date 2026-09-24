import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#071121',
        surface: '#0D182B',
        panel: '#0B1628',
        secondary: '#152337',
        glow: '#102037',
        border: '#23344D',
        foreground: '#D1DAE5',
        muted: '#8B9BB1',
        sky: '#86D2F3',
        destructive: '#DF3A3A',
      },
      fontFamily: {
        // Closest free stand-ins for Ethnocentric (headings) and Avenir Next (body) —
        // both are commercially licensed fonts; see README for how to swap in the real ones.
        slab: ['Orbitron', 'Arial', 'sans-serif'],
        sans: ['Poppins', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
      },
      transitionTimingFunction: {
        section: 'cubic-bezier(0.22,1,0.36,1)',
        overlay: 'cubic-bezier(0.76,0,0.24,1)',
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
