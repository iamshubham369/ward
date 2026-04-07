/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { 950:'#070D18', 900:'#0A1220', 800:'#0F1B2D', 700:'#1A2640', 600:'#243352', 500:'#2E4068', 400:'#3D5580' },
        saffron: { 300:'#FBD96B', 400:'#F5C342', 500:'#E8A317', 600:'#C48A0E', 700:'#9E6F0A' },
        stone: { 50:'#FAF7F4', 100:'#F5F0EB', 200:'#E8E0D6', 300:'#D4C9BC', 400:'#B8A99A' }
      },
      fontFamily: { display:['Playfair Display','serif'], body:['DM Sans','sans-serif'], mono:['JetBrains Mono','monospace'] }
    },
  },
  plugins: [],
}
