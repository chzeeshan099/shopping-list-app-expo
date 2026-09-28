/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
    ],
  presets: [require("nativewind/preset")],
  darkMode: "class", // 👈 YE ZAROORI HAI
  theme: {
    extend: {},
  },
  plugins: [],
};
