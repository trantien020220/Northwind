/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
        extend: {
            colors: {
                primary: "#0f172a",
                accent: "#0891b2",
                sidebar: "#1e293b",
            },
        },
    },
  plugins: []
}
