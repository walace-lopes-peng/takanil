/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'taka-green': {
          DEFAULT: '#37b08d',
          50: '#f2f9f7',
          100: '#e0f2eb',
          200: '#bce2d3',
          300: '#8dcbbb',
          400: '#57a78c',  // Tom fornecido
          500: '#37b08d',  // Logo
          600: '#288c6e',
          700: '#23705a',
          800: '#1e5a49',
          900: '#1a4c34',  // Tom fornecido (Logo Escuro)
        },
        'taka-orange': {
          DEFAULT: '#fe7620',
          50: '#fff8f1',
          100: '#ffefdf',
          200: '#ffdbbf',
          300: '#ffc193',
          400: '#fe9e0b',  // Tom fornecido
          500: '#fe7620',  // Tom fornecido
          600: '#f5a113',  // Tom fornecido
          700: '#c25211',
          800: '#9a4216',
          900: '#7d3815',
        }
      },
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
