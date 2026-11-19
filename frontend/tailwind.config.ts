import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FAF7F2",
          100: "#F6F1E9", // Primary brand ivory
          200: "#ECE3D4",
          300: "#DFD2BC",
          400: "#D0BDA0",
        },
        gold: {
          50: "#F9F5EF",
          100: "#F1E7D7",
          200: "#E3CEAE",
          300: "#D4B384",
          400: "#C99B65",
          500: "#C18B58", // Primary brand gold
          600: "#AA7345",
          700: "#8E5C36",
          800: "#734A2F",
        },
        charcoal: {
          700: "#4A4A4A",
          800: "#3D3D3D",
          900: "#343434", // Primary brand charcoal
        },
        terracotta: {
          500: "#8C4A32", // Secondary brand earth tone
          600: "#753C28",
        },
        border: "#E5DEC9",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        heirloom: "0 4px 20px -2px rgba(52, 52, 52, 0.06), 0 2px 6px -1px rgba(52, 52, 52, 0.04)",
        card: "0 2px 12px rgba(193, 139, 88, 0.08)",
      },
      borderRadius: {
        heirloom: "12px",
      }
    },
  },
  plugins: [],
};

export default config;
