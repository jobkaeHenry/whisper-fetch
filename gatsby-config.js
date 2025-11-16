const path = require('path');

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config = {
  pathPrefix: '/whisper-fetch',
  siteMetadata: {
    title: `Whisper Fetch - Intelligent Background File Prefetching Library`,
    siteUrl: `https://jobkaehenry.github.io/whisper-fetch`,
    description: `Idle-aware, resumable background prefetch library for large files with OPFS/IndexedDB storage. React support, SHA-256 integrity verification, and adaptive chunk sizing.`,
    author: `@jobkaehenry`,
    keywords: [
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
      'resumable download'
    ],
    image: `/og-image.png`,
    twitterUsername: `@jobkaehenry`,
    language: `en`,
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/docs/pages`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./docs/pages/",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`
      }
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `ko`, `ja`, `zh`, `fr`, `es`, `ar`, `hi`],
        defaultLanguage: `en`,
        redirect: false,
        generateDefaultLanguagePage: true,
        siteUrl: `https://github.com/jobkaeHenry/whisper-fetch`,
        i18nextOptions: {
          interpolation: {
            escapeValue: false
          },
          keySeparator: '.',
          nsSeparator: false
        }
      }
    },
    // Temporarily disabled until icon file is created
    // {
    //   resolve: "gatsby-plugin-manifest",
    //   options: {
    //     name: "Whisper Fetch - Intelligent Background File Prefetching",
    //     short_name: "Whisper Fetch",
    //     start_url: "/",
    //     background_color: "#ffffff",
    //     theme_color: "#6366f1",
    //     display: "minimal-ui",
    //     icon: "src/icon.png", // TODO: Add icon file
    //   },
    // },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => 'https://jobkaehenry.github.io/whisper-fetch',
        resolvePages: ({
          allSitePage: { nodes: allPages },
        }) => {
          return allPages.map((page) => {
            return { ...page };
          });
        },
        serialize: ({ path }) => {
          const priority = path === '/' || path === '/en' ? 1.0
            : path.includes('/docs') ? 0.9
            : path.includes('/api') ? 0.8
            : path.includes('/examples') ? 0.7
            : 0.5;

          const changefreq = path === '/' || path === '/en' ? 'daily'
            : path.includes('/docs') || path.includes('/api') ? 'weekly'
            : 'monthly';

          return {
            url: path,
            changefreq,
            priority,
          };
        },
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://jobkaehenry.github.io/whisper-fetch',
        sitemap: 'https://jobkaehenry.github.io/whisper-fetch/sitemap-index.xml',
        policy: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/.cache', '/public'],
          },
          {
            userAgent: 'Googlebot',
            allow: '/',
            crawlDelay: 0,
          },
          {
            userAgent: 'Bingbot',
            allow: '/',
            crawlDelay: 0,
          }
        ],
      },
    },
  ],
};

module.exports = config;
