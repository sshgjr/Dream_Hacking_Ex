# 꿈 해몽 사이트 - Dream Hacking

## 프로젝트 개요

사용자가 꿈 내용을 입력하면 AI가 분석하여 꿈의 의미, 주의사항, 긍정적 전망을 알려주는 웹 서비스

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 3D 비주얼 | Spline (`@splinetool/react-spline`) |
| AI | Claude API (`@anthropic-ai/sdk`, claude-sonnet-4-6) |
| 배포 | Vercel |

## Spline 3D 씬

- URL: `https://prod.spline.design/aXRsBYd0Z2oJDnka/scene.splinecode`
- 메인 페이지 배경 또는 히어로 섹션에 삽입

## 페이지 구조

```
/                → 메인 페이지 (3D 배경 + 꿈 입력 폼)
/result          → 해몽 결과 페이지
```

## 핵심 기능

### 1. 꿈 입력
- 텍스트 입력 (textarea)
- placeholder 예시: "간밤에 꾼 꿈을 자유롭게 적어주세요..."
- 최소 10자 이상 입력 유효성 검사

### 2. AI 해몽 분석
- Claude API를 사용하여 꿈 내용 분석
- API Route: `POST /api/interpret`
- 스트리밍 응답으로 결과를 실시간 표시

### 3. 결과 표시 (3개 섹션)

| 섹션 | 아이콘 | 설명 |
|------|--------|------|
| 꿈의 의미 | 🔮 | 꿈에 등장한 상징과 전체적인 의미 해석 |
| 주의할 점 | ⚠️ | 꿈이 암시하는 조심해야 할 부분 |
| 좋은 징조 | ✨ | 앞으로 기대할 수 있는 긍정적인 일들 |

## 디렉토리 구조

```
dream_hacking/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx            # 메인 페이지 (3D 배경 + 입력 폼)
│   ├── result/
│   │   └── page.tsx        # 해몽 결과 페이지
│   ├── api/
│   │   └── interpret/
│   │       └── route.ts    # Claude 해몽 API
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── SplineBackground.tsx  # Spline 3D 배경 컴포넌트
│   ├── DreamInput.tsx        # 꿈 입력 폼
│   └── ResultCard.tsx        # 결과 카드 컴포넌트
├── lib/
│   └── claude.ts              # Claude API 클라이언트 설정
├── public/
├── .env.local                # ANTHROPIC_API_KEY
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API 설계

### POST /api/interpret

**Request:**
```json
{
  "dream": "어젯밤에 하늘을 나는 꿈을 꿨어요..."
}
```

**Response (스트리밍):**
```json
{
  "meaning": "하늘을 나는 꿈은 자유와 해방을 상징합니다...",
  "caution": "현실에서 너무 큰 목표를 세우고 있지는 않은지...",
  "fortune": "새로운 기회가 찾아올 수 있는 시기입니다..."
}
```

## AI 프롬프트 설계

Claude에게 전달할 시스템 프롬프트:

```
당신은 동양과 서양의 꿈 해몽 전문가입니다.
사용자가 꿈 내용을 전달하면 다음 3가지를 JSON 형식으로 분석해주세요:

1. meaning (꿈의 의미): 꿈에 등장한 상징물과 상황을 바탕으로 꿈의 전체적인 의미를 해석
2. caution (주의할 점): 이 꿈이 암시하는, 현실에서 조심해야 할 부분
3. fortune (좋은 징조): 이 꿈이 암시하는 긍정적인 전망과 앞으로 기대할 수 있는 좋은 일

각 항목은 2~4문장으로 따뜻하고 희망적인 톤으로 작성하세요.
```

## UI/UX 컨셉

- **테마**: 다크 모드 기반, 몽환적인 분위기
- **배경**: Spline 3D 씬 (우주/별/구름 느낌)
- **폰트**: Pretendard (한글), 가독성 우선
- **애니메이션**: 결과 카드 페이드인, 텍스트 타이핑 효과
- **반응형**: 모바일 우선 설계

## 환경 변수

```env
ANTHROPIC_API_KEY=sk-ant-...
```

## 배포 (Vercel)

1. GitHub 레포 연결
2. 환경 변수 `ANTHROPIC_API_KEY` 설정
3. Framework Preset: Next.js (자동 감지)
4. 빌드 & 배포

## 구현 순서

1. Next.js 프로젝트 초기화 + Tailwind 설정
2. Spline 3D 배경 컴포넌트
3. 메인 페이지 (입력 폼) UI
4. Claude API 연동 (`/api/interpret`)
5. 결과 페이지 UI
6. 스트리밍 응답 + 타이핑 애니메이션
7. 반응형 + 마무리 폴리싱
8. Vercel 배포
