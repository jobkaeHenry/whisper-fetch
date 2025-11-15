import React from 'react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import '../styles/global.css';

interface LayoutProps {
  children: React.ReactNode;
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`현재: ${theme === 'light' ? '라이트' : '다크'} 모드`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>Whisper Fetch</h1>
            <span className="version">v1.0.0</span>
          </div>
          <ul className="nav-links">
            <li><a href="/">홈</a></li>
            <li><a href="/docs">문서</a></li>
            <li><a href="/api">API</a></li>
            <li><a href="/examples">예제</a></li>
            <li>
              <a
                href="https://github.com/jobkaeHenry/whisper-fetch"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/">홈</a>
            <a href="/docs">문서</a>
            <a href="/api">API</a>
            <a href="/examples">예제</a>
            <a href="https://github.com/jobkaeHenry/whisper-fetch" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@jobkaehenry/whisper-fetch" target="_blank" rel="noopener noreferrer">
              NPM
            </a>
          </div>
          <p>MIT License © 2024 jobkaehenry</p>
        </div>
      </footer>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
};

export default Layout;
