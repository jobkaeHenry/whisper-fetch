import React from 'react';
import { graphql } from 'gatsby';
import DocLayout from '../components/DocLayout';
import CodeBlock from '../components/CodeBlock';

const DocsPage = () => {
  const installCode = `npm install @jobkaehenry/whisper-fetch`;

  const basicUsageCode = `import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

const prefetcher = new BackgroundPrefetcher({
  url: 'https://cdn.example.com/large-file.bin',
  onProgress: (downloaded, total) => {
    const progress = total ? (downloaded / total) * 100 : 0;
    console.log(\`진행률: \${progress.toFixed(2)}%\`);
  },
  onStatus: (status, error) => {
    console.log('상태:', status);
    if (error) console.error('에러:', error);
  }
});

// 다운로드 시작
await prefetcher.start();`;

  const controlCode = `// 일시정지
prefetcher.pause();

// 재개
await prefetcher.resume();

// 중지 및 정리
prefetcher.stop();

// 완료된 파일 가져오기
const objectURL = await prefetcher.getObjectURL();
if (objectURL) {
  const link = document.createElement('a');
  link.href = objectURL;
  link.download = 'file.bin';
  link.click();
}`;

  const cellularCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  allowOnCellular: true  // 셀룰러에서도 다운로드
});`;

  const saveDataCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  respectSaveData: true  // 데이터 절약 모드 시 다운로드 안함
});`;

  const downlinkCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  minDownlinkMbps: 5  // 5Mbps 이상일 때만 다운로드
});`;

  const chunkSizeCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  chunkSize: 1024 * 1024  // 1MB 고정
});`;

  const integrityCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  integritySha256: 'abc123...'  // 다운로드 완료 후 해시 검증
});`;

  const storeCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  store: 'idb'  // IndexedDB 강제 사용
});`;

  const hookCode = `import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function FileDownloader() {
  const {
    status,      // 'idle' | 'started' | 'paused' | 'resumed' | 'completed' | 'error'
    progress,    // 0-100
    start,
    pause,
    resume,
    stop,
    objectURL
  } = usePrefetcher({
    url: 'https://cdn.example.com/large-file.bin',
    integritySha256: 'optional-hash...'
  });

  return (
    <div>
      <p>상태: {status}</p>
      <p>진행률: {progress.toFixed(2)}%</p>

      <button onClick={start} disabled={status !== 'idle'}>
        시작
      </button>
      <button onClick={pause} disabled={status !== 'started'}>
        일시정지
      </button>
      <button onClick={resume} disabled={status !== 'paused'}>
        재개
      </button>
      <button onClick={stop}>
        중지
      </button>

      {objectURL && (
        <a href={objectURL} download="file.bin">
          다운로드
        </a>
      )}
    </div>
  );
}`;

  const managerBasicCode = `import { PrefetchManagerImpl } from '@jobkaehenry/whisper-fetch';

// 동시에 5개까지 다운로드
const manager = new PrefetchManagerImpl(5);

// 단일 URL 추가
const id = manager.add({
  url: 'https://cdn.example.com/video1.mp4',
  priority: 10,  // 높을수록 우선순위가 높음
  onProgress: (done, total) => console.log(\`\${done}/\${total}\`)
});

// 여러 URL 일괄 추가
const ids = manager.addBatch([
  'https://cdn.example.com/video1.mp4',
  'https://cdn.example.com/video2.mp4',
  { url: 'https://cdn.example.com/video3.mp4', priority: 5 }
]);`;

  const managerControlCode = `// 상태 확인
const status = manager.getStatus(id);
// { status: 'active' | 'queued', progress: { done: number, total?: number } }

// 동시 다운로드 수 동적 변경
manager.setMaxConcurrent(10);

// 일시정지/재개/중단
manager.pause(id);      // 특정 ID만
manager.pause();        // 전체 일시정지
manager.resume(id);     // 특정 ID만
manager.resume();       // 전체 재개
manager.stop(id);       // 특정 ID만
manager.stop();         // 전체 중단

// 제거
manager.remove(id);
await manager.purge(id);`;

  const managerExampleCode = `// 대용량 비디오 여러 개 미리 다운로드
const manager = new PrefetchManagerImpl(3);
const videoIds = manager.addBatch([
  { url: '/videos/ep1.mp4', priority: 10 },  // 현재 에피소드는 우선순위 높게
  { url: '/videos/ep2.mp4', priority: 5 },
  { url: '/videos/ep3.mp4', priority: 1 }
]);

// 네트워크 상태에 따라 동시 다운로드 수 조정
if (navigator.connection?.effectiveType === '4g') {
  manager.setMaxConcurrent(10);
} else {
  manager.setMaxConcurrent(2);
}`;

  const integrityVerifyCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://cdn.example.com/file.bin',
  integritySha256: 'expected-sha256-hash',
  onStatus: (status, error) => {
    if (status === 'error') {
      console.error('무결성 검증 실패:', error);
    }
  }
});`;

  const networkControlCode = `const prefetcher = new BackgroundPrefetcher({
  url: 'https://cdn.example.com/large-video.mp4',
  allowOnCellular: false,      // Wi-Fi에서만 다운로드
  respectSaveData: true,       // 데이터 절약 모드 존중
  minDownlinkMbps: 5,          // 최소 5Mbps 필요
  chunkSize: undefined         // 네트워크 속도에 따라 자동 조정
});`;

  const nextjsAppRouterCode = `'use client';  // Next.js 13+ App Router

import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

export default function VideoPage() {
  const { status, progress, objectURL } = usePrefetcher({
    url: 'https://cdn.example.com/video.mp4'
  });

  return (
    <div>
      <p>진행률: {progress}%</p>
      {objectURL && <video src={objectURL} controls />}
    </div>
  );
}`;

  const nextjsPagesRouterCode = `import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false  // SSR 비활성화
});

export default function Page() {
  return <VideoPlayer />;
}`;

  const testCode = `npm test`;

  const e2eTestCode = `npm run build
npx playwright test`;

  return (
    <DocLayout>
      <div className="section">
        <h1 id="docs">문서</h1>
        <p>Whisper Fetch의 완전한 사용 가이드입니다.</p>
      </div>

      <div className="section">
        <h2 id="installation">설치</h2>
        <CodeBlock code={installCode} language="bash" title="Terminal" />
      </div>

      <div className="section">
        <h2 id="basic-usage">기본 사용법</h2>

        <h3 id="create-prefetcher">BackgroundPrefetcher 생성</h3>
        <CodeBlock code={basicUsageCode} language="typescript" title="index.ts" />

        <h3 id="download-control">다운로드 제어</h3>
        <CodeBlock code={controlCode} language="typescript" title="control.ts" />
      </div>

      <div className="section">
        <h2 id="options">옵션</h2>

        <div className="api-method">
          <h4 id="option-url">url: string</h4>
          <p>다운로드할 파일의 URL (필수)</p>
        </div>

        <div className="api-method">
          <h4 id="option-cellular">allowOnCellular?: boolean</h4>
          <p>셀룰러 네트워크에서 다운로드 허용 여부 (기본값: false)</p>
          <CodeBlock code={cellularCode} language="typescript" />
        </div>

        <div className="api-method">
          <h4 id="option-savedata">respectSaveData?: boolean</h4>
          <p>사용자의 데이터 절약 모드 존중 여부 (기본값: true)</p>
          <CodeBlock code={saveDataCode} language="typescript" />
        </div>

        <div className="api-method">
          <h4 id="option-downlink">minDownlinkMbps?: number</h4>
          <p>최소 네트워크 속도 (Mbps) (기본값: 2)</p>
          <CodeBlock code={downlinkCode} language="typescript" />
        </div>

        <div className="api-method">
          <h4 id="option-chunksize">chunkSize?: number</h4>
          <p>청크 크기 (바이트). 생략 시 네트워크 상태에 따라 자동 조정 (512KB~4MB)</p>
          <CodeBlock code={chunkSizeCode} language="typescript" />
        </div>

        <div className="api-method">
          <h4 id="option-integrity">integritySha256?: string</h4>
          <p>완료 시 검증할 SHA-256 해시 (선택사항)</p>
          <CodeBlock code={integrityCode} language="typescript" />
        </div>

        <div className="api-method">
          <h4 id="option-store">store?: 'opfs' | 'idb'</h4>
          <p>저장소 타입 (기본값: 'opfs', 폴백 지원)</p>
          <CodeBlock code={storeCode} language="typescript" />
        </div>
      </div>

      <div className="section">
        <h2 id="react-hook">React Hook 사용법</h2>

        <h3 id="use-prefetcher">usePrefetcher</h3>
        <CodeBlock code={hookCode} language="tsx" title="FileDownloader.tsx" />
      </div>

      <div className="section">
        <h2 id="prefetch-manager">병렬 URL 다운로드 (PrefetchManager)</h2>
        <p>여러 URL을 동시에 다운로드하여 병목 현상을 제거합니다.</p>

        <h3 id="manager-basic">기본 사용법</h3>
        <CodeBlock code={managerBasicCode} language="typescript" title="manager.ts" />

        <h3 id="manager-control">상태 확인 및 제어</h3>
        <CodeBlock code={managerControlCode} language="typescript" title="control.ts" />

        <h3 id="manager-example">실사용 예제</h3>
        <CodeBlock code={managerExampleCode} language="typescript" title="video-prefetch.ts" />
      </div>

      <div className="section">
        <h2 id="events">이벤트</h2>
        <p>BackgroundPrefetcher는 다양한 상태 이벤트를 발생시킵니다:</p>

        <div className="api-method">
          <h4 id="event-started">started</h4>
          <p>프리페치 루프가 시작됨</p>
        </div>

        <div className="api-method">
          <h4 id="event-paused">paused</h4>
          <p>포그라운드 활동 또는 수동 일시정지로 인해 중단됨</p>
        </div>

        <div className="api-method">
          <h4 id="event-resumed">resumed</h4>
          <p>유휴 상태 후 재개됨</p>
        </div>

        <div className="api-method">
          <h4 id="event-completed">completed</h4>
          <p>모든 바이트를 가져와 조립 완료</p>
        </div>

        <div className="api-method">
          <h4 id="event-stopped">stopped</h4>
          <p>stop() 호출로 중지됨</p>
        </div>

        <div className="api-method">
          <h4 id="event-error">error</h4>
          <p>복구 불가능한 오류 발생</p>
        </div>
      </div>

      <div className="section">
        <h2 id="advanced">고급 사용법</h2>

        <h3 id="storage-selection">저장소 선택</h3>
        <p>
          Whisper Fetch는 두 가지 저장소 메커니즘을 지원합니다:
        </p>
        <ul>
          <li><strong>OPFS (Origin Private File System)</strong>: Chrome 114+ 에서 지원. 스트리밍 쓰기로 최고의 성능 제공</li>
          <li><strong>IndexedDB</strong>: 모든 최신 브라우저에서 지원. OPFS를 사용할 수 없을 때 자동 폴백</li>
        </ul>

        <h3 id="integrity-verification">무결성 검증</h3>
        <p>
          integritySha256 옵션을 제공하면, 다운로드가 완료된 후 조립된 Blob에 대해 SHA-256 해시를 검증합니다.
          해시가 일치하지 않으면 'error' 이벤트가 발생합니다.
        </p>
        <CodeBlock code={integrityVerifyCode} language="typescript" title="verify.ts" />

        <h3 id="network-conditions">네트워크 조건 제어</h3>
        <p>
          모바일 데이터 사용량과 사용자 경험을 최적화하기 위해 다양한 네트워크 조건을 제어할 수 있습니다:
        </p>
        <CodeBlock code={networkControlCode} language="typescript" title="network.ts" />
      </div>

      <div className="section">
        <h2 id="server-requirements">서버 요구사항</h2>
        <p>Whisper Fetch가 올바르게 작동하려면 서버가 다음을 지원해야 합니다:</p>

        <h3 id="required">필수 요구사항</h3>
        <ul>
          <li><strong>HTTP Range 요청</strong>: 206 Partial Content 응답 지원</li>
        </ul>

        <h3 id="recommended">권장 사항</h3>
        <ul>
          <li><strong>ETag 헤더</strong>: 파일 변경 감지를 위해</li>
          <li><strong>If-Range 지원</strong>: 안전한 Range 요청 재개를 위해</li>
        </ul>

        <p>대부분의 CDN (CloudFlare, AWS CloudFront, Fastly 등)은 이러한 요구사항을 기본적으로 지원합니다.</p>
      </div>

      <div className="section">
        <h2 id="nextjs">Next.js 사용법</h2>
        <p>Next.js에서 Whisper Fetch를 사용할 때는 클라이언트 사이드에서만 실행되도록 해야 합니다:</p>

        <CodeBlock code={nextjsAppRouterCode} language="tsx" title="VideoPage.tsx" />

        <p>Pages Router를 사용하는 경우:</p>
        <CodeBlock code={nextjsPagesRouterCode} language="tsx" title="Page.tsx" />
      </div>

      <div className="section">
        <h2 id="testing">테스팅</h2>

        <h3 id="unit-tests">단위 테스트</h3>
        <CodeBlock code={testCode} language="bash" title="Terminal" />

        <h3 id="e2e-tests">E2E 테스트 (Playwright)</h3>
        <CodeBlock code={e2eTestCode} language="bash" title="Terminal" />
      </div>
    </DocLayout>
  );
};

export default DocsPage;

export const Head = () => <title>문서 - Whisper Fetch</title>;

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
