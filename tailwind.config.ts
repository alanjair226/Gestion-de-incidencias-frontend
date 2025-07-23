import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#121212',
          secondary: '#1E1E1E',
          bg: '#101113',
          text: {
            primary: '#E0E0E0',
            secondary: '#A0A0A0',
          },
          accent: '#BB86FC',
          success: '#04b224',
          warning: '#FFC107',
          error: '#e14460',
          period: {
            actual: "#15a64f", // Verde oscuro
            past: "#e94949", // Rojo oscuro
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
