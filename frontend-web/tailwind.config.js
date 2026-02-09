/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121214', // Fundo principal
          800: '#202024', // Cartões e Paineis
          700: '#323238', // Bordas e Inputs
        },
        primary: {
          500: '#8257e5', // Roxo (Cor da marca)
        }
      }
    },
  },
  plugins: [],
}