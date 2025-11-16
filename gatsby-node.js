const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        // Gatsby가 src/pages를 찾도록 docs로 alias 설정
        '@pages': path.resolve(__dirname, 'docs/pages'),
        '@components': path.resolve(__dirname, 'docs/components'),
        '@styles': path.resolve(__dirname, 'docs/styles'),
      },
      // src 폴더를 무시하고 docs를 사용
      modules: [
        path.resolve(__dirname, 'docs'),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  });
};

// docs/pages의 파일들을 페이지로 생성
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Gatsby가 pages를 찾는 기본 경로를 변경하기 위해
  // gatsby-plugin-page-creator를 사용하는 대신 수동으로 페이지 생성
};

// Gatsby가 기본적으로 src/pages를 보지만, 우리는 docs를 사용하므로
// src/pages를 생략하고 gatsby-source-filesystem에서 정의한 경로를 사용
