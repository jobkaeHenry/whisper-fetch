import React from 'react';
import { Helmet } from 'react-helmet';
import { useI18next } from 'gatsby-plugin-react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  article?: boolean;
  pathname?: string;
  lang?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  article = false,
  pathname = '',
  lang
}) => {
  const { language } = useI18next();
  const currentLang = lang || language || 'en';

  const siteUrl = 'https://jobkaehenry.github.io/whisper-fetch';
  const defaultTitle = 'Whisper Fetch - Intelligent Background File Prefetching Library';
  const defaultDescription = 'Idle-aware, resumable background prefetch library for large files with OPFS/IndexedDB storage. React support, SHA-256 integrity verification, and adaptive chunk sizing.';
  const defaultImage = `${siteUrl}/og-image.png`;
  const defaultKeywords = [
    'whisper fetch',
    'background download',
    'prefetch',
    'OPFS',
    'IndexedDB',
    'React',
    'TypeScript',
    'file download',
    'idle detection',
    'range request',
    'resumable download',
    'chunk download',
    'progressive download',
    'network idle',
    'background prefetch'
  ];

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: `${siteUrl}${pathname}`,
    keywords: [...defaultKeywords, ...keywords]
  };

  // 언어별 사이트명
  const siteNames: Record<string, string> = {
    en: 'Whisper Fetch',
    ko: 'Whisper Fetch - 위스퍼 페치',
    ja: 'Whisper Fetch - ウィスパーフェッチ',
    zh: 'Whisper Fetch - 轻声获取',
    fr: 'Whisper Fetch',
    es: 'Whisper Fetch',
    ar: 'Whisper Fetch',
    hi: 'Whisper Fetch'
  };

  const siteName = siteNames[currentLang] || siteNames.en;

  return (
    <Helmet
      htmlAttributes={{
        lang: currentLang,
        dir: currentLang === 'ar' ? 'rtl' : 'ltr'
      }}
    >
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />

      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />

      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${pathname}`} />
      <link rel="alternate" hrefLang="ko" href={`${siteUrl}/ko${pathname}`} />
      <link rel="alternate" hrefLang="ja" href={`${siteUrl}/ja${pathname}`} />
      <link rel="alternate" hrefLang="zh" href={`${siteUrl}/zh${pathname}`} />
      <link rel="alternate" hrefLang="fr" href={`${siteUrl}/fr${pathname}`} />
      <link rel="alternate" hrefLang="es" href={`${siteUrl}/es${pathname}`} />
      <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar${pathname}`} />
      <link rel="alternate" hrefLang="hi" href={`${siteUrl}/hi${pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en${pathname}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLang === 'en' ? 'en_US' : currentLang} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content="@jobkaehenry" />

      {/* Additional Meta Tags */}
      <meta name="author" content="jobkaehenry" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />

      {/* Performance & Security */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />

      {/* GitHub */}
      <meta property="github:repository" content="jobkaeHenry/whisper-fetch" />
      <meta property="github:url" content="https://github.com/jobkaeHenry/whisper-fetch" />
    </Helmet>
  );
};

export default SEO;
