/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#000000',
          dark: '#0a0a0a',
          panel: '#111111',
          orange: '#FF6B00',
          gold: '#FFB800',
          cyan: '#00E5FF',
          text: '#E0E0E0',
          muted: '#666666',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'cyan-pulse': 'cyan-pulse 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'grid-scroll': 'grid-scroll 20s linear infinite',
        'corner-pulse': 'corner-pulse 2s ease-in-out infinite',
        'border-trace': 'border-trace 1.5s linear infinite',
        'breath-glow': 'breath-glow 3s ease-in-out infinite',
        'drift': 'drift 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 4px #FF6B00, 0 0 8px #FF6B00' },
          '50%': { textShadow: '0 0 8px #FF6B00, 0 0 16px rgba(255, 107, 0, 0.6)' },
        },
        'cyan-pulse': {
          '0%, 100%': { textShadow: '0 0 2px #00E5FF, 0 0 6px rgba(0, 229, 255, 0.3)' },
          '50%': { textShadow: '0 0 4px #00E5FF, 0 0 12px rgba(0, 229, 255, 0.5)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2500%)' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
        'grid-scroll': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(50px)' },
        },
        'corner-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'border-trace': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-200' },
        },
        'breath-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 107, 0, 0.2), 0 0 10px rgba(255, 107, 0, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(255, 107, 0, 0.4), 0 0 30px rgba(255, 107, 0, 0.15)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'neon-orange': '0 0 3px #FF6B00, 0 0 6px rgba(255, 107, 0, 0.3)',
        'neon-gold': '0 0 3px #FFB800, 0 0 6px rgba(255, 184, 0, 0.3)',
        'neon-cyan': '0 0 3px #00E5FF, 0 0 6px rgba(0, 229, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
