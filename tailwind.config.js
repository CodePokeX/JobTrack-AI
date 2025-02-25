/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./static/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        myLightBlue: "#e0f7ff",
        myTransparentBlue: "#e0f7ff00",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      "winter",
      "night",
      "synthwave",
      {
        myblueLight: {
          "color-scheme": "light",
          primary: "#007bff" /* Main blue color */,
          secondary: "#0056b3" /* Darker blue */,
          accent: "#66b2ff" /* Lighter blue */,
          neutral: "#f7fafc" /* Background color */,
          "base-100": "#f3f4f6" /* Main background */,
          info: "#17a2b8",
          success: "#28a745",
          warning: "#ffc107",
          error: "#dc3545",
        },
      },
    ],
  },
  darkMode: ["class", '[data-theme="night"]'],
};
