/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07090E',
          card: '#0D121F',
          border: 'rgba(0, 240, 255, 0.15)',
          neonCyan: '#00F0FF',
          neonEmerald: '#00F59B',
          threatRed: '#FF2E54',
          warnAmber: '#FFB800',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0,240,255,0.2))' },
        },
        radarSweep: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}