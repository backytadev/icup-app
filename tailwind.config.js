/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef

import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'login-text': '#ad6632',
        'pastor-color': '#1976D2',
        'copastor-color': '#af30c9',
        'supervisor-color': '#068ef1',
        'preacher-color': '#0abd99',
        'family-group-color': '#FFA000',
        'offering-color': '#FFD700',
        'user-color': '#2aa0cd',
        'disciple-color': '#4CAF50',
        'search-color': '#e6c200',
        vulcan: {
          50: '#f4f6fb',
          100: '#e8ecf6',
          200: '#ccd7eb',
          300: '#9fb5da',
          400: '#6b8dc5',
          500: '#486faf',
          600: '#365793',
          700: '#2d4677',
          800: '#283d64',
          900: '#263554',
          950: '#0e131f',
        },
        mirage: {
          50: '#f4f6fb',
          100: '#e8ecf6',
          200: '#cbd8ec',
          300: '#9db6dc',
          400: '#6990c7',
          500: '#4672b1',
          600: '#345995',
          700: '#2b4779',
          800: '#273e65',
          900: '#253555',
          950: '#111827',
        },
        // ICUP Custom colors
        'icup': {
          'primary': {
            DEFAULT: '#1e3a5f',
            light: '#2563eb',
            dark: '#172554',
          },
          'accent': {
            DEFAULT: '#d4a853',
            light: '#f4d03f',
            dark: '#b8923f',
          },
          'surface': {
            DEFAULT: '#f8fafc',
            elevated: '#ffffff',
            dark: '#0f172a',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeIn: 'fadeIn .7s ease-in-out',
        fadeInPage: 'fadeIn .35s ease-in-out',
        pulse: 'pulse 1.5s ease-in-out infinite',
        bounce: 'bounce 1s infinite',
        slideDown: 'slideDown 300ms ease-out',
        slideUp: 'slideUp 300ms ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.4s ease-out forwards',
        'float-subtle': 'floatSubtle 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      fontFamily: {
        'dancing-script': ['Dancing Script', 'cursive'],
        'outfit': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInScale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      extendUtilities: {
        'animation-delay': {
          100: '0.1s',
          200: '0.2s',
          300: '0.3s',
          400: '0.4s',
        },
      },
      screens: {
        'mid-xl': '1470px',
        '3-xl': '2000px',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [tailwindcssAnimate],
};
