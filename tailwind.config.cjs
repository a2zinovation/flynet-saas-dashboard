/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        flynet: {
          DEFAULT: "#0C2548"
        }
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        'sidebar': '240px'
      }
    }
  },
  plugins: [],
}
// flynet-multi-app/saas-dashboard/tailwind.config.js