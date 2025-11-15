import React from 'react';
import { graphql } from 'gatsby';
import { motion } from 'framer-motion';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';
import LiveDemo from '../components/LiveDemo';

const IndexPage = () => {
  const { t } = useTranslation();

  const installCode = `npm install @jobkaehenry/whisper-fetch`;

  const basicUsageCode = `import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

const prefetcher = new BackgroundPrefetcher({
  url: 'https://cdn.example.com/large-file.bin',
  allowOnCellular: false,
  respectSaveData: true
});

await prefetcher.start();`;

  const reactHookCode = `import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function VideoPlayer() {
  const { progress, status, objectURL } = usePrefetcher({
    url: 'https://cdn.example.com/video.mp4'
  });

  return (
    <div>
      <p>Status: {status} | Progress: {progress}%</p>
      {objectURL && <video src={objectURL} controls />}
    </div>
  );
}`;

  return (
    <Layout>
      <SEO
        title={t('hero.title')}
        description={t('hero.subtitle')}
        keywords={[
          'whisper fetch',
          'background prefetch',
          'idle download',
          'OPFS',
          'IndexedDB',
          'React hooks',
          'TypeScript library',
          'file download',
          'resumable download',
          'range request'
        ]}
        pathname="/"
      />
      <StructuredData
        type="SoftwareApplication"
        name="Whisper Fetch"
        description={t('hero.subtitle')}
        url="https://github.com/jobkaeHenry/whisper-fetch"
      />

      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>{t('hero.title')}</h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <div className="cta-buttons">
            <a href="/docs" className="btn btn-primary">
              {t('hero.getStarted')} →
            </a>
            <a
              href="https://github.com/jobkaeHenry/whisper-fetch"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('hero.viewGithub')} ⭐
            </a>
          </div>
        </motion.div>
      </div>

      <div className="section">
        <LiveDemo
          title={t('demo.title')}
          description={t('demo.description')}
        />
      </div>

      <div className="features">
        <FeatureCard
          icon="🔄"
          title={t('features.intelligentDownload.title')}
          description={t('features.intelligentDownload.description')}
          delay={0}
        />
        <FeatureCard
          icon="⚡"
          title={t('features.adaptiveChunk.title')}
          description={t('features.adaptiveChunk.description')}
          delay={0.1}
        />
        <FeatureCard
          icon="💾"
          title={t('features.storage.title')}
          description={t('features.storage.description')}
          delay={0.2}
        />
        <FeatureCard
          icon="🔐"
          title={t('features.integrity.title')}
          description={t('features.integrity.description')}
          delay={0.3}
        />
        <FeatureCard
          icon="📱"
          title={t('features.mobileFriendly.title')}
          description={t('features.mobileFriendly.description')}
          delay={0.4}
        />
        <FeatureCard
          icon="⚛️"
          title={t('features.reactSupport.title')}
          description={t('features.reactSupport.description')}
          delay={0.5}
        />
      </div>

      <div className="section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>{t('quickStart.title')}</h2>

          <h3>{t('quickStart.installation')}</h3>
          <CodeBlock code={installCode} language="bash" title="Terminal" />

          <h3>{t('quickStart.basicUsage')}</h3>
          <CodeBlock code={basicUsageCode} language="typescript" title="index.ts" />

          <h3>{t('quickStart.reactHook')}</h3>
          <CodeBlock code={reactHookCode} language="tsx" title="VideoPlayer.tsx" />
        </motion.div>
      </div>

      <div className="section">
        <h2>{t('keyFeatures.title')}</h2>

        <h3>{t('keyFeatures.autoPauseResume.title')}</h3>
        <p>{t('keyFeatures.autoPauseResume.description')}</p>

        <h3>{t('keyFeatures.rangeResume.title')}</h3>
        <p>{t('keyFeatures.rangeResume.description')}</p>

        <h3>{t('keyFeatures.serverRequirements.title')}</h3>
        <ul>
          <li>{t('keyFeatures.serverRequirements.item1')}</li>
          <li>{t('keyFeatures.serverRequirements.item2')}</li>
        </ul>
      </div>

      <div className="section">
        <h2>{t('browserSupport.title')}</h2>
        <p>
          <span className="badge badge-success">Chrome 114+</span>
          <span className="badge badge-success">Firefox</span>
          <span className="badge badge-success">Safari</span>
          <span className="badge badge-success">Edge</span>
        </p>
        <p>{t('browserSupport.description')}</p>
      </div>

      <div className="section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>{t('cta.title')}</h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
          {t('cta.description')}
        </p>
        <div className="cta-buttons">
          <a href="/docs" className="btn btn-primary">
            {t('cta.viewDocs')}
          </a>
          <a href="/examples" className="btn btn-secondary">
            {t('cta.viewExamples')}
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

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
