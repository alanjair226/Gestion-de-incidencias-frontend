import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // tailwind.config.js
  theme: {
    extend: {
      colors: {
        "dark": {
          "primary": "#1C1C1E",
          "secondary": "#252528",
          "bg": "#121214",
          "text": {
            "primary": "#EBEBF0",
            "secondary": "#A0A0A5"
          },
          "accent": "#D08DEA",
          "success": "#28A745",
          "warning": "#FFC107",
          "error": "#ca3d3d",
          "period": {
            "actual": "#20C997",
            "past": "#FD7E14"
          },
          "border": "#7f7f7f"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
