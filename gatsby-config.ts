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
  ],
};

export default config;
