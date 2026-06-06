import type { Config } from "tailwindcss";

/**
 * ComfyClub brand tokens (confirmed from design prototypes + Roadmap M1.1).
 * Colors: navy, gold, cream, charcoal. Fonts: Cormorant Garamond + Jost.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class", // dashboard dark/light theme (Phase 3)
  theme: {
    extend: {
      colors: {
        navy: "#0F1D35",
        gold: "#C9A84C",
        cream: "#F7F4EE",
        charcoal: "#2C2C2C",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-jost)", "Jost", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
