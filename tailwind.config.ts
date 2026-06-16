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
        navyLight: "#162744",
        navyHover: "#1d3356",
        gold: "#C9A84C",
        cream: "#F7F4EE",
        charcoal: "#2C2C2C",
        whatsapp: "#25D366",
        sale: "#e74c3c",
        // Dashboard admin palette (from the design prototype)
        panel: "#f5f6fa", // light canvas
        line: "#e8e8ee", // card borders
        ink: "#3a3f51", // primary text (design "text")
        muted: "#8b8fa7", // secondary text (design "textLight")
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        pop: "0 12px 40px rgba(0,0,0,0.12)",
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
