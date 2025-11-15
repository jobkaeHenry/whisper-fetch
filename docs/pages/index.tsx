import React from 'react';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <div className="hero">
        <h1>Whisper Fetch</h1>
        <p>
          대용량 파일을 네트워크 아이들 상태에서 백그라운드에서 청크로 프리패치하는 지능형 라이브러리
        </p>
        <div className="cta-buttons">
          <a href="/docs" className="btn btn-primary">
            시작하기
          </a>
          <a
            href="https://github.com/jobkaeHenry/whisper-fetch"
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🔄 지능형 백그라운드 다운로드</h3>
          <p>
            포그라운드 네트워크 활동 시 자동으로 일시정지하고, 유휴 상태에서 재개하여 사용자 경험을 방해하지 않습니다.
          </p>
        </div>

        <div className="feature-card">
          <h3>⚡ 적응형 청크 크기</h3>
          <p>
            네트워크 상태에 따라 512KB부터 4MB까지 청크 크기를 자동 조정하여 최적의 다운로드 성능을 제공합니다.
          </p>
        </div>

        <div className="feature-card">
          <h3>💾 OPFS/IndexedDB 저장소</h3>
          <p>
            Chrome의 OPFS 스트리밍을 우선 사용하고, 다른 브라우저에서는 IndexedDB로 자동 폴백하여 광범위한 호환성을 제공합니다.
          </p>
        </div>

        <div className="feature-card">
          <h3>🔐 무결성 검증</h3>
          <p>
            선택적 SHA-256 해시 검증으로 다운로드된 파일의 무결성을 보장합니다.
          </p>
        </div>

        <div className="feature-card">
          <h3>📱 모바일 친화적</h3>
          <p>
            셀룰러 네트워크 제어, 데이터 절약 모드 존중, 최소 네트워크 속도 설정 등 모바일 환경을 고려한 설계입니다.
          </p>
        </div>

        <div className="feature-card">
          <h3>⚛️ React 지원</h3>
          <p>
            사용하기 쉬운 React Hook을 제공하여 React 애플리케이션에서 즉시 사용할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="section">
        <h2>빠른 시작</h2>

        <h3>설치</h3>
        <div className="code-block">
          <pre><code>npm install @jobkaehenry/whisper-fetch</code></pre>
        </div>

        <h3>기본 사용법</h3>
        <div className="code-block">
          <pre><code>{`import { BackgroundPrefetcher } from '@jobkaehenry/whisper-fetch';

const prefetch = new BackgroundPrefetcher({
  url: 'https://cdn.example.com/large-file.bin'
});

prefetch.start();`}</code></pre>
        </div>

        <h3>React Hook</h3>
        <div className="code-block">
          <pre><code>{`import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function VideoPlayer() {
  const { progress, status, objectURL } = usePrefetcher({
    url: 'https://cdn.example.com/video.mp4'
  });

  return (
    <div>
      <p>상태: {status}</p>
      <p>진행률: {progress}%</p>
      {objectURL && <video src={objectURL} controls />}
    </div>
  );
}`}</code></pre>
        </div>
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
    </Layout>
  );
};

export default IndexPage;

export const Head = () => <title>Whisper Fetch - 지능형 백그라운드 파일 프리페치</title>;
