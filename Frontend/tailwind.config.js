/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/index.tsx", "./app/components/**/*.{js,jsx,ts,tsx}", "./app/screens/**/*.{js,jsx,ts,tsx}", "./app/auth/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

