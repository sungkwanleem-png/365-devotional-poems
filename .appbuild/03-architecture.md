# 03-Architecture — 365일 말씀 묵상 시집 사이트

## 스택
- **프레임워크**: Astro (정적사이트, `output: 'static'`). SSR/서버 불필요 — 빌드 결과물이
  순수 정적 HTML이라 Vercel 정적 호스팅에 그대로 배포 가능.
- **언어**: TypeScript (Astro 컴포넌트 `.astro` + 콘텐츠 스키마 타입 체크용).
- **스타일링**: 순수 CSS(전역 스타일시트) + Astro scoped `<style>`. 별도 CSS 프레임워크
  (Tailwind 등) 도입 안 함 — 미니멀 타이포그래피 디자인에는 유틸리티 클래스 난립보다
  소수의 의미 있는 CSS 변수(색·간격·서체 스케일)가 더 적합하다고 판단.
- **콘텐츠 저장**: 파일시스템 기반 Astro Content Collections(마크다운 + 프론트매터).
  별도 데이터베이스 없음 — 콘텐츠 원본이 이미 `../집필부/day_XXX.md`로 파일 관리되고 있고,
  이 사이트도 동일하게 "파일 = 콘텐츠"인 것이 감수부 검수 흐름과 일관적이다.
- **저장소**: `사이트개발부/` 자체가 신규 독립 git 저장소 루트(기존 instructor-site와
  무관). 원격(GitHub)·Vercel 연결은 이번 슬라이스 범위 밖(오너 승인 필요).

## 디렉터리 구조
```
사이트개발부/
├── .appbuild/              (기획·검증 문서 — 이 스킬 산출물)
├── src/
│   ├── content/
│   │   ├── config.ts        (content collection 스키마 정의)
│   │   └── days/
│   │       ├── day-001.md
│   │       ├── day-002.md
│   │       └── day-003.md
│   ├── data/
│   │   └── months.ts         (12개월 대주제·성경범위 — master_plan.md 표를 코드화)
│   ├── layouts/
│   │   └── BaseLayout.astro  (공통 HTML shell, 타이포그래피 전역 스타일)
│   ├── components/
│   │   └── DayNav.astro      (이전/다음 날 네비게이션)
│   ├── pages/
│   │   ├── index.astro       (표지, F1)
│   │   ├── toc.astro         (목차, F2)
│   │   └── day/
│   │       └── [day].astro   (일일 묵상 페이지, F3+F4 — getStaticPaths)
│   └── styles/
│       └── global.css        (CSS 변수: 색·서체·spacing 스케일)
├── public/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 데이터 모델

### Content Collection: `days`
소스: `src/content/days/day-XXX.md` (파일명 = slug, 3자리 zero-pad).

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `day` | number | ✅ | 일련번호(1~365). 정렬·prev/next 계산의 기준키. |
| `title` | string | ✅ | 원본 `# Day 00N. <제목>`에서 "Day 00N." 접두사를 뗀 순수 제목. |
| `scriptureRef` | string | ✅ | 성경 출처(예: "창세기 1장 1절"). |
| `scriptureText` | string | ✅ | 성경 본문 인용(개역개정). 여러 절이면 개행 유지. |
| `scriptureVersion` | string | ✅ | 원문 출처 표기(예: "Genesis 1:1, 개역개정"). |
| `month` | number (1~12) | ✅ | 소속 월 — `months.ts`의 월 데이터와 매핑, 목차 그룹핑에 사용. |
| `afterword` | string | ✅ | 원본 "*짧은 여운*" 문단 텍스트. |
| body (markdown) | markdown | ✅ | 묵상시 본문(원본의 시 부분 그대로, 연 구분 위해 빈 줄 유지). |

스키마는 `src/content/config.ts`에서 Zod로 강제(필수 필드 누락 시 빌드 실패 → 조기 발견).

### 정적 데이터: `months` (`src/data/months.ts`)
`master_plan.md`의 연간 구성 표 12행을 그대로 코드화 — 각 항목: `{ month: number, theme: string,
bibleRange: string }`. 목차 페이지가 이 배열을 순회하며 각 월 아래 해당 `day.month`가 일치하는
콘텐츠를 나열한다. day가 아직 없는 월은 빈 섹션으로 표시(비활성).

## 라우팅
- `/` — 표지 (F1)
- `/toc` — 목차 (F2)
- `/day/1`, `/day/2`, `/day/3`, … — 일일 페이지, `getStaticPaths()`가 `days` 컬렉션을
  순회해 정적 경로를 생성(F3). 같은 컴포넌트가 prev/next 계산(F4: `day - 1`/`day + 1`이
  컬렉션에 존재하는지로 판정).

## 마이그레이션 규칙 (원본 → content collection)
`day_00N.md`(집필부 원본, 자유 마크다운) → `day-00N.md`(사이트, 구조화 프론트매터):
1. `# Day 00N. <제목>` → frontmatter `title`(접두사 제거) + `day: N`.
2. `> **<출처>**\n> "<본문>"\n> (<영문출처>)` 블록쿼트 → `scriptureRef`/`scriptureText`/
   `scriptureVersion` 3필드로 분해.
3. 첫 `---` 구분선 이후 ~ 다음 `---` 이전의 본문(시) → markdown body로 그대로 이관(연 구분
   빈 줄 보존).
4. `*짧은 여운* — <텍스트>` → frontmatter `afterword`(멀티라인은 YAML block scalar `|`로).
5. `month`은 `master_plan.md` 표에서 해당 day가 속한 월을 수동 매핑(day_001~003은 모두
   창세기 1장 범위 → 1월 "시작 — 태초의 빛").

## 배포 (이번 슬라이스 범위 밖 — 참고용 계획만)
- GitHub: 오너 승인 후 신규 remote repo 생성·push.
- Vercel: 오너 로그인/프로젝트 연결 필요 — 도달 시 중단하고 master에 보고, 사람 단계 완료 후
  이어감(Astro 프리셋 기본 설정으로 충분, 별도 서버리스 함수 없음).
