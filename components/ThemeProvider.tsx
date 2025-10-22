"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to load CSS with promise
function loadCSS(id: string, href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Remove existing link if present
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    
    document.head.appendChild(link);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function applyTheme() {
      setIsLoading(true);
      
      try {
        // First, apply the theme class immediately for CSS variables
        document.documentElement.className = theme;
        
        // Then load external stylesheets in parallel
        const githubCSSUrl = theme === 'dark'
          ? 'https://unpkg.com/github-markdown-css@5/github-markdown-dark.css'
          : 'https://unpkg.com/github-markdown-css@5/github-markdown-light.css';
          
        // Note: We use custom highlight.js styles in globals.css instead of external CSS
        // to avoid conflicts and have better control over the styling
        
        // Load only the GitHub markdown CSS
        await loadCSS('github-markdown-css', githubCSSUrl);
        
        // Force a small delay to ensure CSS is fully applied
        await new Promise(resolve => setTimeout(resolve, 50));
        
        console.log('Theme successfully applied:', theme);
      } catch (error) {
        console.error('Error applying theme:', error);
        // Fallback: at least ensure the theme class is applied
        document.documentElement.className = theme;
      } finally {
        setIsLoading(false);
      }
    }
    
    applyTheme();
  }, [theme]);

  const toggleTheme = () => {
    if (!isLoading) {
      setTheme(prev => prev === "dark" ? "light" : "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
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