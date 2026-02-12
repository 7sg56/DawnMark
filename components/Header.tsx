"use client";

import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon, GithubIcon, LoaderIcon } from "./Icons";

export default function Header() {
  const { theme, toggleTheme, isLoading } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="app-header">
      <div className="brand" title="DawnMark">
        <span className="brand-text">DawnMark</span>
      </div>
      <div className="header-actions">
        <button 
          className={`theme-toggle ${isLoading ? 'loading' : ''}`}
          onClick={toggleTheme}
          disabled={isLoading}
          title={isLoading ? 'Loading theme...' : `Switch to ${isDark ? 'light' : 'dark'} theme`}
          aria-label={isLoading ? 'Loading theme...' : `Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isLoading ? (
            <LoaderIcon />
          ) : isDark ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>
        <a
          className="github-btn"
          href="https://github.com/7sg56/dawnmark"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          aria-label="View DawnMark source code on GitHub"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  );
}