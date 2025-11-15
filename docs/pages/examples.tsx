import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';

const ExamplesPage = () => {
  const videoExample = `import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function VideoPreloader() {
  const { progress, status, objectURL, start } = usePrefetcher({
    url: 'https://cdn.example.com/movie-4k.mp4',
    allowOnCellular: false,  // Wi-Fi에서만
    minDownlinkMbps: 5       // 최소 5Mbps
  });

  return (
    <div>
      {!objectURL ? (
        <div>
          <button onClick={start}>비디오 프리로드</button>
          <progress value={progress} max="100" />
          <span>{progress.toFixed(1)}%</span>
        </div>
      ) : (
        <video src={objectURL} controls autoPlay />
      )}
    </div>
  );
}`;

  const gameAssetsExample = `import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

class GameAssetLoader {
  private prefetchers = new Map();

  async preloadLevel(levelId: number) {
    const assets = [
      \`/assets/levels/\${levelId}/textures.bundle\`,
      \`/assets/levels/\${levelId}/models.bundle\`,
      \`/assets/levels/\${levelId}/audio.bundle\`
    ];

    for (const url of assets) {
      const prefetcher = new BackgroundPrefetcher({
        url,
        chunkSize: 2 * 1024 * 1024,  // 2MB chunks
        integritySha256: await this.getAssetHash(url),
        onProgress: (downloaded, total) => {
          this.updateLoadingBar(url, downloaded, total);
        }
      });

      this.prefetchers.set(url, prefetcher);
      await prefetcher.start();
    }
  }

  async getAsset(url: string): Promise<Blob> {
    const prefetcher = this.prefetchers.get(url);
    if (!prefetcher) throw new Error('Asset not preloaded');

    const objectURL = await prefetcher.getObjectURL();
    const response = await fetch(objectURL);
    return response.blob();
  }
}`;

  const documentExample = `import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function PDFViewer({ documentId }: { documentId: string }) {
  const { objectURL, status, progress } = usePrefetcher({
    url: \`/api/documents/\${documentId}/pdf\`,
    respectSaveData: true,
    integritySha256: documentId // 문서 ID를 해시로 사용
  });

  if (status === 'downloading') {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>문서 로딩 중... {progress.toFixed(0)}%</p>
      </div>
    );
  }

  if (!objectURL) {
    return <p>문서를 불러올 수 없습니다</p>;
  }

  return (
    <iframe
      src={objectURL}
      width="100%"
      height="800px"
      title="PDF Viewer"
    />
  );
}`;

  const nextjsExample = `// app/video/[id]/page.tsx
'use client';

import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';
import { useParams } from 'next/navigation';

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;

  const {
    objectURL,
    status,
    progress,
    start,
    pause,
    resume
  } = usePrefetcher({
    url: \`https://api.example.com/videos/\${videoId}\`,
    allowOnCellular: false
  });

  return (
    <div className="container">
      <h1>Video Player</h1>

      {!objectURL ? (
        <div className="preload-controls">
          <button onClick={start} disabled={status !== 'idle'}>
            로드 시작
          </button>
          <button onClick={pause} disabled={status !== 'started'}>
            일시정지
          </button>
          <button onClick={resume} disabled={status !== 'paused'}>
            재개
          </button>

          <div className="progress">
            <div className="bar" style={{ width: \`\${progress}%\` }} />
          </div>
          <p>{status} - {progress.toFixed(1)}%</p>
        </div>
      ) : (
        <video src={objectURL} controls width="100%" />
      )}
    </div>
  );
}`;

  const offlineExample = `import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

class OfflineContentManager {
  private db: IDBDatabase;

  async downloadForOffline(articles: Article[]) {
    for (const article of articles) {
      // 아티클 이미지 다운로드
      for (const imageUrl of article.images) {
        const prefetcher = new BackgroundPrefetcher({
          url: imageUrl,
          store: 'idb',  // IndexedDB 사용
          respectSaveData: true,
          onStatus: async (status) => {
            if (status === 'completed') {
              const blob = await this.getBlobFromPrefetcher(prefetcher);
              await this.saveToCache(imageUrl, blob);
            }
          }
        });

        await prefetcher.start();
      }
    }
  }

  async getBlobFromPrefetcher(
    prefetcher: BackgroundPrefetcher
  ): Promise<Blob> {
    const url = await prefetcher.getObjectURL();
    if (!url) throw new Error('Download not completed');

    const response = await fetch(url);
    return response.blob();
  }

  async saveToCache(url: string, blob: Blob) {
    // Cache API에 저장
    const cache = await caches.open('offline-content');
    await cache.put(url, new Response(blob));
  }
}`;

  const progressiveExample = `import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function ProgressiveImageLoader({ imageUrl }: { imageUrl: string }) {
  const [showPreview, setShowPreview] = useState(true);

  const { objectURL, progress } = usePrefetcher({
    url: imageUrl,
    chunkSize: 512 * 1024  // 512KB chunks for progressive loading
  });

  return (
    <div className="image-container">
      {showPreview && progress < 100 && (
        <div className="preview-layer">
          <img src={getThumbnail(imageUrl)} alt="Preview" />
          <div className="loading-overlay">
            <div className="progress-ring" style={{
              background: \`conic-gradient(
                var(--primary) \${progress * 3.6}deg,
                #ddd 0deg
              )\`
            }} />
          </div>
        </div>
      )}

      {objectURL && (
        <img
          src={objectURL}
          alt="Full quality"
          onLoad={() => setShowPreview(false)}
          className={showPreview ? 'hidden' : 'visible'}
        />
      )}
    </div>
  );
}

function getThumbnail(url: string): string {
  return url.replace(/\\.(jpg|png)$/, '-thumb.$1');
}`;

  return (
    <Layout>
      <div className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>사용 예제</h1>
          <p className="hero-subtitle">
            Whisper Fetch를 실제 프로젝트에서 활용하는 다양한 방법을 확인하세요
          </p>
        </motion.div>
      </div>

      <div className="section">
        <h2>비디오 스트리밍 플랫폼</h2>
        <p>
          대용량 비디오 파일을 사용자가 시청하기 전에 미리 다운로드하여
          버퍼링 없는 시청 경험을 제공합니다.
        </p>
        <CodeBlock code={videoExample} language="tsx" title="VideoPreloader.tsx" />
      </div>

      <div className="section">
        <h2>게임 에셋 로더</h2>
        <p>
          게임의 다음 레벨 에셋을 백그라운드에서 미리 로드하여
          레벨 전환 시 로딩 시간을 최소화합니다.
        </p>
        <CodeBlock code={gameAssetsExample} language="typescript" title="GameAssetLoader.ts" />
      </div>

      <div className="section">
        <h2>문서 뷰어</h2>
        <p>
          대용량 PDF나 문서 파일을 효율적으로 프리로드하여
          즉시 표시할 수 있도록 준비합니다.
        </p>
        <CodeBlock code={documentExample} language="tsx" title="PDFViewer.tsx" />
      </div>

      <div className="section">
        <h2>Next.js 통합</h2>
        <p>
          Next.js App Router에서 Whisper Fetch를 사용하는 방법입니다.
          클라이언트 컴포넌트로 마크하여 SSR 이슈를 방지합니다.
        </p>
        <CodeBlock code={nextjsExample} language="tsx" title="page.tsx" />
      </div>

      <div className="section">
        <h2>오프라인 콘텐츠 관리</h2>
        <p>
          사용자가 나중에 오프라인에서 볼 수 있도록
          콘텐츠를 미리 다운로드하고 캐시에 저장합니다.
        </p>
        <CodeBlock code={offlineExample} language="typescript" title="OfflineContentManager.ts" />
      </div>

      <div className="section">
        <h2>프로그레시브 이미지 로딩</h2>
        <p>
          저화질 썸네일을 먼저 표시하고, 고화질 이미지를
          백그라운드에서 로드하여 부드러운 전환 효과를 제공합니다.
        </p>
        <CodeBlock code={progressiveExample} language="tsx" title="ProgressiveImageLoader.tsx" />
      </div>

      <div className="section">
        <h2>더 많은 사용 사례</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎵</div>
            <h3>음악 스트리밍</h3>
            <p>
              재생목록의 다음 곡들을 미리 다운로드하여
              끊김 없는 음악 재생 경험을 제공합니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>전자책 리더</h3>
            <p>
              사용자가 현재 읽고 있는 챕터를 기반으로
              다음 챕터를 미리 로드합니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>디자인 툴</h3>
            <p>
              고해상도 에셋과 폰트 파일을
              백그라운드에서 로드하여 즉시 사용 가능하게 합니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>데이터 시각화</h3>
            <p>
              대용량 데이터셋을 미리 다운로드하여
              빠른 차트 렌더링을 제공합니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>영상 편집기</h3>
            <p>
              타임라인의 다음 클립들을 미리 로드하여
              부드러운 편집 경험을 제공합니다.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>지도 애플리케이션</h3>
            <p>
              주변 타일과 레이어를 미리 다운로드하여
              빠른 지도 탐색을 가능하게 합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>여러분의 프로젝트에 적용해보세요</h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
          Whisper Fetch는 다양한 사용 사례에 맞게 유연하게 설정할 수 있습니다
        </p>
        <div className="cta-buttons">
          <a href="/docs" className="btn btn-primary">
            문서 보기
          </a>
          <a href="/api" className="btn btn-secondary">
            API 레퍼런스
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ExamplesPage;

export const Head = () => (
  <>
    <title>사용 예제 - Whisper Fetch</title>
    <meta
      name="description"
      content="Whisper Fetch를 실제 프로젝트에서 활용하는 다양한 예제: 비디오 스트리밍, 게임 에셋 로딩, 문서 뷰어, Next.js 통합 등"
    />
  </>
);
