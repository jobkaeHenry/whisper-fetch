import React from 'react';
import { Helmet } from 'react-helmet';

interface StructuredDataProps {
  type?: 'WebSite' | 'SoftwareApplication' | 'TechArticle' | 'HowTo';
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'WebSite',
  name = 'Whisper Fetch',
  description = 'Intelligent background file prefetching library for large files',
  url = 'https://jobkaehenry.github.io/whisper-fetch',
  image = 'https://jobkaehenry.github.io/whisper-fetch/og-image.png',
  author = { name: 'jobkaehenry', url: 'https://github.com/jobkaeHenry' },
  datePublished = '2024-01-01',
  dateModified = new Date().toISOString().split('T')[0]
}) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      name,
      description,
      url,
      image
    };

    if (type === 'SoftwareApplication') {
      return {
        ...baseData,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        author: {
          '@type': 'Person',
          name: author.name,
          url: author.url
        },
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'JavaScript',
        softwareVersion: '1.0.0',
        applicationSubCategory: 'File Management, Download Manager',
        featureList: [
          'Background file prefetching',
          'Idle-aware downloading',
          'OPFS and IndexedDB storage',
          'Range-based resume',
          'SHA-256 integrity verification',
          'React Hook support',
          'Adaptive chunk sizing'
        ]
      };
    }

    if (type === 'TechArticle' || type === 'HowTo') {
      return {
        ...baseData,
        author: {
          '@type': 'Person',
          name: author.name,
          url: author.url
        },
        datePublished,
        dateModified,
        publisher: {
          '@type': 'Organization',
          name: 'Whisper Fetch',
          logo: {
            '@type': 'ImageObject',
            url: image
          }
        }
      };
    }

    // WebSite
    return {
      ...baseData,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      creator: {
        '@type': 'Person',
        name: author.name,
        url: author.url
      }
    };
  };

  const structuredData = getStructuredData();

  // Breadcrumb 추가
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: url
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Documentation',
        item: `${url}/docs`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'API Reference',
        item: `${url}/api`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Examples',
        item: `${url}/examples`
      }
    ]
  };

  // Organization 추가
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Whisper Fetch',
    url,
    logo: image,
    sameAs: [
      'https://github.com/jobkaeHenry/whisper-fetch',
      'https://www.npmjs.com/package/@jobkaehenry/whisper-fetch'
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
