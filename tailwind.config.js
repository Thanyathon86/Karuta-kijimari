/** @type {import('tailwindcss').Config} */
module.exports = {
  // แก้ไขตรงนี้ให้ครอบคลุมโฟลเดอร์ src ของคุณ
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}