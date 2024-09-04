// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Twoje pliki projektu
  ],
  theme: {
    extend: {
      keyframes: {
        slideFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideToRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        slideFromLeft: 'slideFromLeft 1s ease-out forwards',
        slideToRight: 'slideToRight 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
