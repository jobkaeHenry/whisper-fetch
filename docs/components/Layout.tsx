import React from 'react';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import { ThemeProvider, useTheme } from './ThemeProvider';
import LanguageSwitcher from './LanguageSwitcher';
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
      title={`${theme === 'light' ? 'Dark' : 'Light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useI18next();

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1>
              <Link to="/">Whisper Fetch</Link>
            </h1>
            <span className="version">v1.0.1</span>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">{t("nav.home")}</Link>
            </li>
            <li>
              <Link to="/docs">{t("nav.docs")}</Link>
            </li>
            <li>
              <Link to="/api">{t("nav.api")}</Link>
            </li>
            <li>
              <Link to="/examples">{t("nav.examples")}</Link>
            </li>
            <li>
              <a
                href="https://github.com/jobkaeHenry/whisper-fetch"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("nav.github")}
              </a>
            </li>
            <li>
              <LanguageSwitcher />
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
            <Link to="/">{t("nav.home")}</Link>
            <Link to="/docs">{t("nav.docs")}</Link>
            <Link to="/api">{t("nav.api")}</Link>
            <Link to="/examples">{t("nav.examples")}</Link>
            <a
              href="https://github.com/jobkaeHenry/whisper-fetch"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("nav.github")}
            </a>
            <a
              href="https://www.npmjs.com/package/@jobkaehenry/whisper-fetch"
              target="_blank"
              rel="noopener noreferrer"
            >
              NPM
            </a>
          </div>
          <p>{t("footer.license")}</p>
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
