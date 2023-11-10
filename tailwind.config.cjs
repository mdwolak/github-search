/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme");

const shades = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
];
const colourList = ["green"];
const colorSafeList = [];

for (const colorName of colourList) {
  shades.map((shade) => {
    colorSafeList.push(`text-${colorName}-${shade}`);
    colorSafeList.push(`bg-${colorName}-${shade}`);
  });
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: colorSafeList,
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ...
        tahiti: {
          light: "#67e8f9",
          DEFAULT: "#06b6d4",
          dark: "#0e7490",
        },

        // ...
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
