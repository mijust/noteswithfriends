// File location: /tailwind.config.js
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
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'custom-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            h1: {
              color: theme('colors.secondary.900'),
              fontWeight: '800',
            },
            h2: {
              color: theme('colors.secondary.900'),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.secondary.900'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.secondary.900'),
              fontWeight: '600',
            },
            code: {
              color: theme('colors.secondary.900'),
              backgroundColor: theme('colors.secondary.100'),
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
            pre: {
              backgroundColor: theme('colors.secondary.800'),
              color: theme('colors.secondary.50'),
              overflowX: 'auto',
              borderRadius: '0.375rem',
            },
            blockquote: {
              borderLeftColor: theme('colors.secondary.200'),
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.secondary.200'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.secondary.50'),
            },
            h2: {
              color: theme('colors.secondary.50'),
            },
            h3: {
              color: theme('colors.secondary.100'),
            },
            h4: {
              color: theme('colors.secondary.100'),
            },
            code: {
              color: theme('colors.secondary.100'),
              backgroundColor: theme('colors.secondary.800'),
            },
            blockquote: {
              borderLeftColor: theme('colors.secondary.600'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add more plugins as needed
  ],
  darkMode: 'media', // or 'class' for manual toggling
};