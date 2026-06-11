import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("theme");
    return (saved as "light" | "dark" | "system") || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemTheme) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle system theme updates dynamically
  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <div id="theme-toggle" className="flex items-center gap-1 bg-[#0B0B0B]/10 dark:bg-white/10 p-1 rounded-full border border-black/10 dark:border-white/10">
      <button
        id="theme-light-btn"
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "light"
            ? "bg-[#D4AF37] text-[#0B0B0B] shadow-sm"
            : "text-[#0B0B0B]/60 dark:text-white/60 hover:text-[#D4AF37]"
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        id="theme-dark-btn"
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "dark"
            ? "bg-[#D4AF37] text-[#0B0B0B] shadow-sm"
            : "text-[#0B0B0B]/60 dark:text-white/60 hover:text-[#D4AF37]"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        id="theme-system-btn"
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "system"
            ? "bg-[#D4AF37] text-[#0B0B0B] shadow-sm"
            : "text-[#0B0B0B]/60 dark:text-white/60 hover:text-[#D4AF37]"
        }`}
        title="System Theme"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
