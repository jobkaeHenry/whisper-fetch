import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
        <h2>페이지를 찾을 수 없습니다</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          요청하신 페이지가 존재하지 않습니다.
        </p>
        <a href="/" className="btn btn-primary">
          홈으로 돌아가기
        </a>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const Head = () => <title>404: 페이지를 찾을 수 없음 - Whisper Fetch</title>;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
