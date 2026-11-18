import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        abee: {
          // Palet profesional: hitam, putih, abu netral, emas, zamrud gelap.
          green: "#0B3D39",
          teal: "#0F766E",
          dark: "#0B3D39",
          gold: "#C9A227",
          goldlight: "#D4AF37",
          cream: "#F5F5F4",
          ink: "#111111",
        },
        ink: "#0A0A0A",
        gold: "#C9A227",
        goldlight: "#D4AF37",
        emeralddeep: "#0B3D39",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Georgia", '"Times New Roman"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
