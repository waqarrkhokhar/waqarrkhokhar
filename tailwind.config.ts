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
        panel: "#f4f6fb", // light canvas
        line: "#e6e8f0", // card borders
        ink: "#2b3040", // primary text (design "text") — darker for contrast
        muted: "#666c85", // secondary text (design "textLight") — darker, more readable
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,29,53,0.06), 0 1px 2px rgba(15,29,53,0.04)",
        cardHover: "0 8px 24px rgba(15,29,53,0.10)",
        pop: "0 16px 48px rgba(15,29,53,0.16)",
        glass: "0 4px 24px rgba(15,29,53,0.08)",
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
