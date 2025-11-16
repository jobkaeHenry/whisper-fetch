// Import global CSS
require('./docs/styles/global.css');

// Re-export from gatsby-ssr to ensure consistency
exports.wrapPageElement = require('./gatsby-ssr.js').wrapPageElement;
exports.wrapRootElement = require('./gatsby-ssr.js').wrapRootElement;

// Browser language detection and auto-redirect
exports.onClientEntry = () => {
  // Only run on initial page load at root path
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'fr', 'es', 'ar', 'hi'];
    const defaultLanguage = 'en';

    // Check if user has previously selected a language
    const savedLanguage = localStorage.getItem('gatsby-i18next-language');

    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      // Use previously saved language
      window.location.replace(`/${savedLanguage}/`);
      return;
    }

    // Detect browser language
    const browserLanguage = navigator.language || navigator.userLanguage;

    // Extract the primary language code (e.g., 'ko' from 'ko-KR')
    const primaryLanguage = browserLanguage.split('-')[0].toLowerCase();

    // Check if the detected language is supported
    const targetLanguage = supportedLanguages.includes(primaryLanguage)
      ? primaryLanguage
      : defaultLanguage;

    // Save the detected/default language
    localStorage.setItem('gatsby-i18next-language', targetLanguage);

    // Redirect to the appropriate language page
    window.location.replace(`/${targetLanguage}/`);
  }
};
