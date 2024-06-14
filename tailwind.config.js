const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      Ubuntu: ["Ubuntu", "sans-serif"],
      "hind-vadodara": ["Hind Vadodara", "sans-serif"],
    },
    extend: {
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        128: "32rem",
        144: "36rem",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            "primary-light": "#BEE8FF",
            "primary-main": "#159ED8",
            "primary-dark": "#0F3A4F",
            "warning-light": "#F3C77F",
            "warning-main": "#F5A524",
            "info-light": "#86C5DF",
            "info-main": "#159ED8",
            "success-light": "#94DDB4",
            "success-main": "#17C964",
            "danger-light": "#F3C6D1",
            "danger-main": "#F31248",
            "grey-light": "#EBECED",
            "grey-main": "#6C6E79",
            "grey-dark": "#51555C",
            "gradientColor1": '#ffffff',
            "gradientColor2": '#bee3f3',
          },
        },
        dark: {
          colors: {
            "primary-light": "#BEE8FF",
            "primary-main": "#159ED8",
            "primary-dark": "#092A3B",
            "warning-light": "#F3C77F",
            "warning-main": "#F5A524",
            "info-light": "#86C5DF",
            "info-main": "#159ED8",
            "success-light": "#94DDB4",
            "success-main": "#17C964",
            "danger-light": "#F3C6D1",
            "danger-main": "#F31248",
            "grey-light": "#EBECED",
            "grey-main": "#6C6E79",
            "grey-dark": "#51555C",
            "gradientColor1": '#0F3A4F',
            "gradientColor2": '#bee3f3',
          },
        },
      },
    }),
  ],
};
