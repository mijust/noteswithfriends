/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        typography: {
          DEFAULT: {
            css: {
              a: {
                color: '#2563eb',
                '&:hover': {
                  color: '#1d4ed8',
                },
              },
              h1: {
                color: '#111827',
                fontWeight: '800',
              },
              h2: {
                color: '#111827',
                fontWeight: '700',
              },
              h3: {
                color: '#111827',
                fontWeight: '600',
              },
              h4: {
                color: '#111827',
                fontWeight: '600',
              },
              code: {
                color: '#111827',
                backgroundColor: '#f3f4f6',
                padding: '0.25rem',
                borderRadius: '0.25rem',
                fontWeight: '400',
                '&::before': {
                  content: '""',
                },
                '&::after': {
                  content: '""',
                },
              },
              'code::before': {
                content: '""!important',
              },
              'code::after': {
                content: '""!important',
              },
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };