// master_plan.md "연간 구성" 표를 코드화한 12개월 대주제 데이터.
export interface MonthMeta {
  month: number;
  theme: string;
  bibleRange: string;
}

export const months: MonthMeta[] = [
  { month: 1, theme: '시작 — 태초의 빛', bibleRange: '창세기 1~11장 (창조, 타락, 노아)' },
  { month: 2, theme: '부르심 — 약속의 발걸음', bibleRange: '창세기 12~50장 (아브라함, 요셉)' },
  { month: 3, theme: '해방 — 광야로 가는 길', bibleRange: '출애굽기 1~24장' },
  { month: 4, theme: '거룩 — 성막과 율법', bibleRange: '출애굽기 25장~레위기, 민수기' },
  { month: 5, theme: '광야의 신실함', bibleRange: '신명기, 여호수아' },
  { month: 6, theme: '사사와 룻 — 평범한 자의 순종', bibleRange: '사사기, 룻기' },
  { month: 7, theme: '왕과 기름부음', bibleRange: '사무엘상하' },
  { month: 8, theme: '지혜와 탄식', bibleRange: '열왕기, 욥기, 잠언' },
  { month: 9, theme: '시편 — 영혼의 언어', bibleRange: '시편 (전체월)' },
  { month: 10, theme: '예언자의 눈물과 소망', bibleRange: '이사야, 예레미야, 소예언서' },
  { month: 11, theme: '성육신 — 오신 그분', bibleRange: '사복음서 (마태~요한)' },
  { month: 12, theme: '부활과 새 하늘 새 땅', bibleRange: '사도행전, 서신서, 요한계시록' },
];
