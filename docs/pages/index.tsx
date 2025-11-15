import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';
import LiveDemo from '../components/LiveDemo';

const IndexPage = () => {
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
      <p>상태: {status} | 진행률: {progress}%</p>
      {objectURL && <video src={objectURL} controls />}
    </div>
  );
}`;

  return (
    <Layout>
      <div className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Whisper Fetch</h1>
          <p className="hero-subtitle">
            대용량 파일을 네트워크 아이들 상태에서 백그라운드로 프리페치하는 지능형 라이브러리
          </p>
          <div className="cta-buttons">
            <a href="/docs" className="btn btn-primary">
              시작하기 →
            </a>
            <a
              href="https://github.com/jobkaeHenry/whisper-fetch"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ⭐
            </a>
          </div>
        </motion.div>
      </div>

      <div className="section">
        <LiveDemo
          title="인터랙티브 데모"
          description="Whisper Fetch가 어떻게 작동하는지 직접 확인해보세요"
        />
      </div>

      <div className="features">
        <FeatureCard
          icon="🔄"
          title="지능형 백그라운드 다운로드"
          description="포그라운드 네트워크 활동 시 자동으로 일시정지하고, 유휴 상태에서 재개하여 사용자 경험을 방해하지 않습니다."
          delay={0}
        />
        <FeatureCard
          icon="⚡"
          title="적응형 청크 크기"
          description="네트워크 상태에 따라 512KB부터 4MB까지 청크 크기를 자동 조정하여 최적의 다운로드 성능을 제공합니다."
          delay={0.1}
        />
        <FeatureCard
          icon="💾"
          title="OPFS/IndexedDB 저장소"
          description="Chrome의 OPFS 스트리밍을 우선 사용하고, 다른 브라우저에서는 IndexedDB로 자동 폴백하여 광범위한 호환성을 제공합니다."
          delay={0.2}
        />
        <FeatureCard
          icon="🔐"
          title="무결성 검증"
          description="선택적 SHA-256 해시 검증으로 다운로드된 파일의 무결성을 보장합니다."
          delay={0.3}
        />
        <FeatureCard
          icon="📱"
          title="모바일 친화적"
          description="셀룰러 네트워크 제어, 데이터 절약 모드 존중, 최소 네트워크 속도 설정 등 모바일 환경을 고려한 설계입니다."
          delay={0.4}
        />
        <FeatureCard
          icon="⚛️"
          title="React 지원"
          description="사용하기 쉬운 React Hook을 제공하여 React 애플리케이션에서 즉시 사용할 수 있습니다."
          delay={0.5}
        />
      </div>

      <div className="section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>빠른 시작</h2>

          <h3>설치</h3>
          <CodeBlock code={installCode} language="bash" title="Terminal" />

          <h3>기본 사용법</h3>
          <CodeBlock code={basicUsageCode} language="typescript" title="index.ts" />

          <h3>React Hook</h3>
          <CodeBlock code={reactHookCode} language="tsx" title="VideoPlayer.tsx" />
        </motion.div>
      </div>

      <div className="section">
        <h2>주요 특징</h2>

        <h3>자동 일시정지/재개</h3>
        <p>
          사용자가 능동적으로 네트워크를 사용할 때 자동으로 다운로드를 일시정지하고,
          네트워크가 유휴 상태가 되면 자동으로 재개합니다. 이를 통해 사용자 경험을 방해하지 않으면서도
          효율적으로 대용량 파일을 프리페치할 수 있습니다.
        </p>

        <h3>Range 기반 재개 가능</h3>
        <p>
          HTTP Range 요청을 사용하여 중단된 다운로드를 이어서 받을 수 있습니다.
          네트워크 오류나 사용자의 일시정지 후에도 처음부터 다시 다운로드할 필요 없이
          중단된 지점부터 계속할 수 있습니다.
        </p>

        <h3>서버 요구사항</h3>
        <ul>
          <li>HTTP Range 지원 (206 Partial Content)</li>
          <li>ETag/If-Range 권장 (안전한 재개를 위해)</li>
        </ul>
      </div>

      <div className="section">
        <h2>브라우저 지원</h2>
        <p>
          <span className="badge badge-success">Chrome 114+</span>
          <span className="badge badge-success">Firefox 최신</span>
          <span className="badge badge-success">Safari 최신</span>
          <span className="badge badge-success">Edge 최신</span>
        </p>
        <p>
          Chrome 114 이상에서는 OPFS 스트리밍을 사용하여 최고의 성능을 제공합니다.
          다른 최신 브라우저에서는 IndexedDB 폴백을 통해 지원됩니다.
        </p>
      </div>

      <div className="section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>지금 시작하세요</h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
          Whisper Fetch로 사용자 경험을 향상시키세요
        </p>
        <div className="cta-buttons">
          <a href="/docs" className="btn btn-primary">
            문서 보기
          </a>
          <a href="/examples" className="btn btn-secondary">
            예제 보기
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head = () => (
  <>
    <title>Whisper Fetch - 지능형 백그라운드 파일 프리페치 라이브러리</title>
    <meta
      name="description"
      content="대용량 파일을 네트워크 아이들 상태에서 백그라운드로 프리페치하는 지능형 JavaScript/TypeScript 라이브러리. OPFS/IndexedDB 저장소, React 지원, 무결성 검증 포함."
    />
    <meta name="keywords" content="prefetch, background download, OPFS, IndexedDB, React, TypeScript, file download, idle detection" />
    <meta property="og:title" content="Whisper Fetch - 지능형 백그라운드 파일 프리페치" />
    <meta property="og:description" content="대용량 파일을 네트워크 아이들 상태에서 백그라운드로 프리페치하는 지능형 라이브러리" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Whisper Fetch - 지능형 백그라운드 파일 프리페치" />
  </>
);
