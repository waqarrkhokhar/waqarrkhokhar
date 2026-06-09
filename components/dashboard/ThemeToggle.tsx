"use client";

import { useEffect, useState } from "react";

/**
 * Dashboard dark/light theme toggle.
 * Persists to localStorage and toggles the `dark` class on <html>
 * (Tailwind darkMode: 'class'). Frontend storefront is unaffected.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cc-theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("cc-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10 hover:text-white"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
