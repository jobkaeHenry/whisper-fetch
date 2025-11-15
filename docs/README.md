# Whisper Fetch 문서 사이트

이 디렉토리는 Whisper Fetch 라이브러리의 공식 문서 및 홍보 페이지를 포함합니다.

## 개발 서버 실행

```bash
npm run docs:develop
```

개발 서버는 `http://localhost:8000` 에서 실행됩니다.

## 프로덕션 빌드

```bash
npm run docs:build
```

빌드된 파일은 `public/` 디렉토리에 생성됩니다.

## 빌드된 사이트 미리보기

```bash
npm run docs:serve
```

## 캐시 정리

```bash
npm run docs:clean
```

## 구조

```
docs/
├── pages/          # 페이지 파일들
│   ├── index.tsx   # 홈/랜딩 페이지
│   ├── docs.tsx    # 문서 페이지
│   └── api.tsx     # API 레퍼런스 페이지
├── components/     # 재사용 가능한 컴포넌트
│   └── Layout.tsx  # 레이아웃 컴포넌트
└── styles/         # 스타일 파일
    └── global.css  # 글로벌 스타일
```

## 기술 스택

- **Gatsby**: React 기반 정적 사이트 생성기
- **TypeScript**: 타입 안전성
- **CSS**: 커스텀 스타일링

## 페이지 추가하기

`docs/pages/` 디렉토리에 새로운 `.tsx` 파일을 추가하면 자동으로 라우트가 생성됩니다.

예: `docs/pages/examples.tsx` → `/examples` 경로
