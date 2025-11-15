import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Whisper Fetch - Intelligent Background File Prefetching Library`,
    siteUrl: `https://github.com/jobkaeHenry/whisper-fetch`,
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
        siteUrl: `https://github.com/jobkaeHenry/whisper-fetch`,
        i18nextOptions: {
          interpolation: {
            escapeValue: false
          },
          keySeparator: '.',
          nsSeparator: false
        },
        pages: [
          {
            matchPath: '/:lang?',
            getLanguageFromPath: true
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Whisper Fetch - Intelligent Background File Prefetching",
        short_name: "Whisper Fetch",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#6366f1",
        display: "minimal-ui",
        icon: "src/icon.png", // This will be optional
      },
    },
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
        resolveSiteUrl: () => 'https://github.com/jobkaeHenry/whisper-fetch',
        resolvePages: ({
          allSitePage: { nodes: allPages },
        }: any) => {
          return allPages.map((page: any) => {
            return { ...page };
          });
        },
        serialize: ({ path }: any) => {
          // 언어별 우선순위 설정
          const priority = path === '/' || path === '/en' ? 1.0
            : path.includes('/docs') ? 0.9
            : path.includes('/api') ? 0.8
            : path.includes('/examples') ? 0.7
            : 0.5;

          // 변경 빈도
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
        host: 'https://github.com/jobkaeHenry/whisper-fetch',
        sitemap: 'https://github.com/jobkaeHenry/whisper-fetch/sitemap-index.xml',
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

export default config;
