import React from 'react';
import Layout from '../components/Layout';

const ApiPage = () => {
  return (
    <Layout>
      <div className="section">
        <h1>API 레퍼런스</h1>
        <p>Whisper Fetch의 전체 API 문서입니다.</p>
      </div>

      <div className="section">
        <h2>BackgroundPrefetcher</h2>
        <p>대용량 파일을 백그라운드에서 프리페치하는 메인 클래스입니다.</p>

        <h3>생성자</h3>
        <div className="api-method">
          <h4>new BackgroundPrefetcher(options: PrefetchOptions)</h4>
          <p>새로운 BackgroundPrefetcher 인스턴스를 생성합니다.</p>

          <div className="param-list">
            <div className="param">
              <span className="param-name">url</span>
              <span className="param-type">: string (필수)</span>
              <p>다운로드할 파일의 URL</p>
            </div>

            <div className="param">
              <span className="param-name">allowOnCellular</span>
              <span className="param-type">?: boolean</span>
              <p>셀룰러 네트워크에서 다운로드 허용 여부 (기본값: false)</p>
            </div>

            <div className="param">
              <span className="param-name">respectSaveData</span>
              <span className="param-type">?: boolean</span>
              <p>사용자의 데이터 절약 모드 존중 여부 (기본값: true)</p>
            </div>

            <div className="param">
              <span className="param-name">minDownlinkMbps</span>
              <span className="param-type">?: number</span>
              <p>최소 네트워크 속도 (Mbps) (기본값: 2)</p>
            </div>

            <div className="param">
              <span className="param-name">chunkSize</span>
              <span className="param-type">?: number</span>
              <p>청크 크기 (바이트). 생략 시 네트워크 상태에 따라 512KB~4MB로 자동 조정</p>
            </div>

            <div className="param">
              <span className="param-name">integritySha256</span>
              <span className="param-type">?: string</span>
              <p>완료 시 검증할 SHA-256 해시</p>
            </div>

            <div className="param">
              <span className="param-name">store</span>
              <span className="param-type">?: 'opfs' | 'idb'</span>
              <p>저장소 타입 (기본값: 'opfs')</p>
            </div>

            <div className="param">
              <span className="param-name">onProgress</span>
              <span className="param-type">?: (downloaded: number, total?: number) =&gt; void</span>
              <p>진행률 콜백 함수</p>
            </div>

            <div className="param">
              <span className="param-name">onStatus</span>
              <span className="param-type">?: (status: Status, error?: any) =&gt; void</span>
              <p>상태 변경 콜백 함수</p>
            </div>
          </div>
        </div>

        <h3>메서드</h3>

        <div className="api-method">
          <h4>start(): Promise&lt;void&gt;</h4>
          <p>백그라운드 프리페치를 시작합니다. 유휴 상태를 자동으로 감지하여 다운로드합니다.</p>
          <div className="code-block">
            <pre><code>{`const prefetcher = new BackgroundPrefetcher({ url: '...' });
await prefetcher.start();`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>pause(): void</h4>
          <p>즉시 다운로드를 일시정지합니다.</p>
          <div className="code-block">
            <pre><code>prefetcher.pause();</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>resume(): Promise&lt;void&gt;</h4>
          <p>유휴 상태를 확인하며 다운로드를 재개합니다.</p>
          <div className="code-block">
            <pre><code>await prefetcher.resume();</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>stop(): void</h4>
          <p>다운로드를 중지하고 리소스를 정리합니다.</p>
          <div className="code-block">
            <pre><code>prefetcher.stop();</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>getObjectURL(): Promise&lt;string | null&gt;</h4>
          <p>다운로드가 완료된 경우 조립된 Blob의 Object URL을 반환합니다.</p>
          <div className="code-block">
            <pre><code>{`const url = await prefetcher.getObjectURL();
if (url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'file.bin';
  link.click();
}`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>React Hook: usePrefetcher</h2>
        <p>React 애플리케이션에서 쉽게 사용할 수 있는 Hook입니다.</p>

        <div className="api-method">
          <h4>usePrefetcher(options: PrefetchOptions)</h4>
          <p>BackgroundPrefetcher를 React 컴포넌트에서 사용하기 위한 Hook입니다.</p>

          <div className="param-list">
            <div className="param">
              <span className="param-name">options</span>
              <span className="param-type">: PrefetchOptions</span>
              <p>BackgroundPrefetcher 생성자와 동일한 옵션 (onProgress, onStatus 제외)</p>
            </div>
          </div>

          <h4>반환값</h4>
          <div className="param-list">
            <div className="param">
              <span className="param-name">status</span>
              <span className="param-type">: Status</span>
              <p>현재 다운로드 상태 ('idle' | 'started' | 'paused' | 'resumed' | 'completed' | 'stopped' | 'error')</p>
            </div>

            <div className="param">
              <span className="param-name">progress</span>
              <span className="param-type">: number</span>
              <p>다운로드 진행률 (0-100)</p>
            </div>

            <div className="param">
              <span className="param-name">start</span>
              <span className="param-type">: () =&gt; Promise&lt;void&gt;</span>
              <p>다운로드를 시작하는 함수</p>
            </div>

            <div className="param">
              <span className="param-name">pause</span>
              <span className="param-type">: () =&gt; void</span>
              <p>다운로드를 일시정지하는 함수</p>
            </div>

            <div className="param">
              <span className="param-name">resume</span>
              <span className="param-type">: () =&gt; Promise&lt;void&gt;</span>
              <p>다운로드를 재개하는 함수</p>
            </div>

            <div className="param">
              <span className="param-name">stop</span>
              <span className="param-type">: () =&gt; void</span>
              <p>다운로드를 중지하는 함수</p>
            </div>

            <div className="param">
              <span className="param-name">objectURL</span>
              <span className="param-type">: string | null</span>
              <p>완료된 파일의 Object URL (완료 전에는 null)</p>
            </div>

            <div className="param">
              <span className="param-name">error</span>
              <span className="param-type">: any</span>
              <p>에러가 발생한 경우 에러 객체</p>
            </div>
          </div>

          <div className="code-block">
            <pre><code>{`import { usePrefetcher } from '@jobkaehenry/whisper-fetch/react';

function MyComponent() {
  const {
    status,
    progress,
    start,
    pause,
    resume,
    stop,
    objectURL,
    error
  } = usePrefetcher({
    url: 'https://cdn.example.com/file.bin'
  });

  return (
    <div>
      <p>상태: {status}</p>
      <p>진행률: {progress}%</p>
      {error && <p>에러: {error.message}</p>}
      {objectURL && <a href={objectURL}>다운로드</a>}
    </div>
  );
}`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>PrefetchManager</h2>
        <p>여러 URL을 동시에 관리하고 병렬 다운로드를 제어하는 클래스입니다.</p>

        <h3>생성자</h3>
        <div className="api-method">
          <h4>new PrefetchManagerImpl(maxConcurrent?: number)</h4>
          <p>동시 다운로드 제한과 함께 새로운 PrefetchManager 인스턴스를 생성합니다.</p>
          <div className="param-list">
            <div className="param">
              <span className="param-name">maxConcurrent</span>
              <span className="param-type">?: number</span>
              <p>동시에 다운로드할 수 있는 최대 URL 개수 (기본값: 2)</p>
            </div>
          </div>
          <div className="code-block">
            <pre><code>{`import { PrefetchManagerImpl } from '@jobkaehenry/whisper-fetch';

const manager = new PrefetchManagerImpl(5);  // 동시에 최대 5개`}</code></pre>
          </div>
        </div>

        <h3>메서드</h3>

        <div className="api-method">
          <h4>add(opts: ManagedPrefetchOptions): string</h4>
          <p>단일 URL을 큐에 추가하고 고유 ID를 반환합니다.</p>
          <div className="param-list">
            <div className="param">
              <span className="param-name">opts</span>
              <span className="param-type">: ManagedPrefetchOptions</span>
              <p>PrefetchOptions를 확장하며 priority와 id 필드가 추가됩니다.</p>
            </div>
          </div>
          <div className="code-block">
            <pre><code>{`const id = manager.add({
  url: 'https://cdn.example.com/video.mp4',
  priority: 10,
  onProgress: (done, total) => console.log(\`\${done}/\${total}\`)
});`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>addBatch(urls: (string | ManagedPrefetchOptions)[]): string[]</h4>
          <p>여러 URL을 한 번에 큐에 추가하고 ID 배열을 반환합니다.</p>
          <div className="code-block">
            <pre><code>{`const ids = manager.addBatch([
  'https://cdn.example.com/video1.mp4',
  'https://cdn.example.com/video2.mp4',
  { url: 'https://cdn.example.com/video3.mp4', priority: 5 }
]);`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>setMaxConcurrent(n: number): void</h4>
          <p>동시 다운로드 제한을 변경합니다.</p>
          <div className="code-block">
            <pre><code>{`// 네트워크 상태에 따라 동적 조정
if (navigator.connection?.effectiveType === '4g') {
  manager.setMaxConcurrent(10);
} else {
  manager.setMaxConcurrent(2);
}`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>pause(id?: string): void</h4>
          <p>특정 다운로드 또는 모든 다운로드를 일시정지합니다.</p>
          <div className="code-block">
            <pre><code>{`manager.pause(id);  // 특정 다운로드만
manager.pause();    // 모든 다운로드`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>resume(id?: string): void</h4>
          <p>특정 다운로드 또는 모든 다운로드를 재개합니다.</p>
          <div className="code-block">
            <pre><code>{`manager.resume(id);  // 특정 다운로드만
manager.resume();    // 모든 다운로드`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>stop(id?: string): void</h4>
          <p>특정 다운로드 또는 모든 다운로드를 중지합니다.</p>
          <div className="code-block">
            <pre><code>{`manager.stop(id);  // 특정 다운로드만
manager.stop();    // 모든 다운로드`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>remove(id: string): boolean</h4>
          <p>다운로드를 큐에서 제거합니다.</p>
          <div className="code-block">
            <pre><code>{`const removed = manager.remove(id);`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>getStatus(id: string)</h4>
          <p>다운로드의 현재 상태와 진행률을 반환합니다.</p>
          <div className="code-block">
            <pre><code>{`const status = manager.getStatus(id);
// { status: 'active' | 'queued', progress: { done: number, total?: number } } | null`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>purge(id: string): Promise&lt;void&gt;</h4>
          <p>다운로드된 데이터를 정리하고 큐에서 제거합니다.</p>
          <div className="code-block">
            <pre><code>{`await manager.purge(id);`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>타입 정의</h2>

        <div className="api-method">
          <h4>Status</h4>
          <p>다운로드 상태를 나타내는 타입입니다.</p>
          <div className="code-block">
            <pre><code>{`type Status =
  | 'idle'      // 시작 전
  | 'started'   // 다운로드 진행 중
  | 'paused'    // 일시정지됨
  | 'resumed'   // 재개됨
  | 'completed' // 완료됨
  | 'stopped'   // 중지됨
  | 'error';    // 에러 발생`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>PrefetchOptions</h4>
          <p>BackgroundPrefetcher 옵션 타입입니다.</p>
          <div className="code-block">
            <pre><code>{`interface PrefetchOptions {
  url: string;
  allowOnCellular?: boolean;
  respectSaveData?: boolean;
  minDownlinkMbps?: number;
  chunkSize?: number;
  integritySha256?: string;
  store?: 'opfs' | 'idb';
  onProgress?: (downloaded: number, total?: number) => void;
  onStatus?: (status: Status, error?: any) => void;
}`}</code></pre>
          </div>
        </div>

        <div className="api-method">
          <h4>ManagedPrefetchOptions</h4>
          <p>PrefetchManager에서 사용하는 옵션 타입입니다.</p>
          <div className="code-block">
            <pre><code>{`interface ManagedPrefetchOptions extends PrefetchOptions {
  priority?: number;  // 우선순위 (기본값: 0, 높을수록 먼저 처리)
  id?: string;        // 고유 ID (미지정 시 자동 생성)
}`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>네트워크 감지 API</h2>
        <p>Whisper Fetch는 브라우저의 Network Information API를 사용하여 네트워크 상태를 감지합니다.</p>

        <h3>지원되는 네트워크 속성</h3>
        <ul>
          <li><strong>effectiveType</strong>: '4g', '3g', '2g', 'slow-2g'</li>
          <li><strong>downlink</strong>: 예상 다운로드 속도 (Mbps)</li>
          <li><strong>saveData</strong>: 사용자의 데이터 절약 모드 활성화 여부</li>
          <li><strong>type</strong>: 'cellular', 'wifi', 'ethernet', 'none', 'unknown'</li>
        </ul>

        <p>이러한 속성들을 기반으로 자동으로 다운로드 시점과 청크 크기를 조정합니다.</p>
      </div>

      <div className="section">
        <h2>저장소 API</h2>

        <h3>OPFS (Origin Private File System)</h3>
        <p>Chrome 114 이상에서 지원되는 고성능 파일 저장소입니다.</p>
        <ul>
          <li>스트리밍 쓰기 지원</li>
          <li>메모리 효율적</li>
          <li>대용량 파일에 최적화</li>
        </ul>

        <h3>IndexedDB</h3>
        <p>모든 최신 브라우저에서 지원되는 폴백 저장소입니다.</p>
        <ul>
          <li>광범위한 브라우저 호환성</li>
          <li>청크 단위로 저장 후 조립</li>
          <li>OPFS를 사용할 수 없을 때 자동 사용</li>
        </ul>

        <div className="code-block">
          <pre><code>{`// 저장소 명시적 선택
const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  store: 'idb'  // IndexedDB 강제 사용
});`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>에러 처리</h2>
        <p>Whisper Fetch는 다양한 에러 상황을 처리합니다:</p>

        <h3>네트워크 에러</h3>
        <div className="code-block">
          <pre><code>{`const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  onStatus: (status, error) => {
    if (status === 'error') {
      if (error.message.includes('Network')) {
        console.error('네트워크 오류:', error);
        // 재시도 로직
      }
    }
  }
});`}</code></pre>
        </div>

        <h3>무결성 검증 실패</h3>
        <div className="code-block">
          <pre><code>{`const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  integritySha256: 'expected-hash',
  onStatus: (status, error) => {
    if (status === 'error' && error.message.includes('integrity')) {
      console.error('파일 무결성 검증 실패');
      // 재다운로드 또는 사용자에게 알림
    }
  }
});`}</code></pre>
        </div>

        <h3>저장소 에러</h3>
        <div className="code-block">
          <pre><code>{`const prefetcher = new BackgroundPrefetcher({
  url: 'https://...',
  onStatus: (status, error) => {
    if (status === 'error' && error.message.includes('storage')) {
      console.error('저장소 오류 (용량 부족 가능성)');
      // 저장소 공간 확인 또는 정리
    }
  }
});`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2>성능 최적화 팁</h2>

        <h3>1. 적절한 청크 크기 선택</h3>
        <p>대부분의 경우 자동 조정이 최적이지만, 특정 상황에서는 수동 설정이 유용할 수 있습니다:</p>
        <ul>
          <li>느린 네트워크: 512KB - 1MB</li>
          <li>빠른 네트워크: 2MB - 4MB</li>
        </ul>

        <h3>2. 저장소 선택</h3>
        <p>Chrome 사용자가 많다면 OPFS를 사용하여 최고의 성능을 얻을 수 있습니다.</p>

        <h3>3. 네트워크 조건 설정</h3>
        <p>모바일 사용자를 위해 allowOnCellular와 minDownlinkMbps를 적절히 설정하세요.</p>

        <h3>4. 메모리 관리</h3>
        <div className="code-block">
          <pre><code>{`// 사용 완료 후 Object URL 정리
const url = await prefetcher.getObjectURL();
if (url) {
  // 사용
  downloadFile(url);

  // 정리
  URL.revokeObjectURL(url);
  prefetcher.stop();
}`}</code></pre>
        </div>
      </div>
    </Layout>
  );
};

export default ApiPage;

export const Head = () => <title>API 레퍼런스 - Whisper Fetch</title>;
