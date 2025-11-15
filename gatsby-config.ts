import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Whisper Fetch`,
    siteUrl: `https://github.com/jobkaeHenry/whisper-fetch`,
    description: `Idle-aware, resumable background prefetch library for large files with OPFS/IDB storage`,
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-typescript",
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
        name: "Whisper Fetch - 지능형 백그라운드 파일 프리페치",
        short_name: "Whisper Fetch",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#6366f1",
        display: "minimal-ui",
        icon: "src/icon.png", // This will be optional
      },
    },
  ],
};

export default config;
