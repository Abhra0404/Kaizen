/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          surface: '#1a1a1a',
          card: '#1e1e1e',
          input: '#2a2a2a',
          hover: '#333333',
          border: '#444444',
          accent: '#888888',
          muted: '#888888',
          secondary: '#B0B0B0',
          primary: '#E0E0E0',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
