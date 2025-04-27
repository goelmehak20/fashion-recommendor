/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F7',
          100: '#FFEBEF',
          200: '#FFCDD7',
          300: '#FFA3B9',
          400: '#FF769A',
          500: '#FF4785', // Main primary color
          600: '#EB3572',
          700: '#C4245F',
          800: '#9C1D4A',
          900: '#75173A',
        },
        secondary: {
          50: '#F3EFFB',
          100: '#E9E3F8',
          200: '#D3C7F0',
          300: '#B5A3E3',
          400: '#9774D4',
          500: '#6B46C1', // Main secondary color
          600: '#5839A8',
          700: '#472C8A',
          800: '#36236C',
          900: '#251A4E',
        },
        accent: {
          50: '#E6F7FF',
          100: '#C3EBFF',
          200: '#9CDDFF',
          300: '#69CFFF',
          400: '#38BDF8', // Main accent color
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Main success color
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Main warning color
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Main error color
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};