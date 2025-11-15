import React from 'react';
import '../styles/global.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
            <li>
              <a
                href="https://github.com/jobkaeHenry/whisper-fetch"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>MIT License © 2024 jobkaehenry</p>
      </footer>
    </div>
  );
};

export default Layout;
