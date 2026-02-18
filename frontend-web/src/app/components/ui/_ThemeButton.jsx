import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./_button";

export function ThemeButton() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saveTheme = localStorage.getItem("thene");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (saveTheme === "dark" || (!saveTheme && systemPrefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 transition-all hover:bg-accent hover:text-accent-foreground"
      title="Alternar Tema"
    >
      {/* Ícones com animação de escala */}
      {theme === "dark" ? (
        <Moon className="h-5 w-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Sun className="h-5 w-5 text-orange-500 transition-transform rotate-0 scale-100" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
