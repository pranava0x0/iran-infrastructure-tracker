"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Map, Target, Table2, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Map", icon: Map },
  { href: "/scenario", label: "Scenario Builder", icon: Target },
  { href: "/table", label: "Data Table", icon: Table2 },
];

export default function NavBar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = stored === "dark";
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-[1000] border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <span className="mr-3 text-sm font-bold tracking-tight text-primary">
            ME-DC Strike Analyzer
          </span>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}
