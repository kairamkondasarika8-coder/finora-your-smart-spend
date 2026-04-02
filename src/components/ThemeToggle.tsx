import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('finora_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem('finora_theme');
    if (saved === 'dark') setDark(true);
    else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
  }, []);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="relative p-2 rounded-full bg-secondary hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-primary" />}
    </button>
  );
}
