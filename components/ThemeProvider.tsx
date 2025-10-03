"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Apply theme class to html element
    document.documentElement.className = theme;
    console.log('Theme changed to:', theme);
    
    // Dynamically load GitHub markdown CSS based on theme
    const existingGithubLink = document.getElementById('github-markdown-css');
    if (existingGithubLink) {
      existingGithubLink.remove();
    }
    
    const githubLink = document.createElement('link');
    githubLink.id = 'github-markdown-css';
    githubLink.rel = 'stylesheet';
    githubLink.href = theme === 'dark'
      ? 'https://unpkg.com/github-markdown-css@5/github-markdown-dark.css'
      : 'https://unpkg.com/github-markdown-css@5/github-markdown-light.css';
    document.head.appendChild(githubLink);
    
    // Dynamically load highlight.js CSS based on theme
    const existingHljsLink = document.getElementById('highlightjs-css');
    if (existingHljsLink) {
      existingHljsLink.remove();
    }
    
    const hljsLink = document.createElement('link');
    hljsLink.id = 'highlightjs-css';
    hljsLink.rel = 'stylesheet';
    hljsLink.href = theme === 'dark'
      ? 'https://unpkg.com/highlight.js@11.10.0/styles/github-dark-dimmed.css'
      : 'https://unpkg.com/highlight.js@11.10.0/styles/github.css';
    document.head.appendChild(hljsLink);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}