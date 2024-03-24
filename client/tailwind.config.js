/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      gridTemplateAreas: {
        "main-layout": ["hero", "results", "footer"],
      },
      gridTemplateColumns: {
        "main-layout": "100%",
      },
      gridTemplateRows: {
        "main-layout": "90vh min-content 1fr",
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
}

