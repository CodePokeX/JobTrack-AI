/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./static/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("daisyui"),
  ],
  daisyui: {
    themes: ["winter", "night", "synthwave"],
  },
  darkMode: ['class', '[data-theme="night"]'],
}
