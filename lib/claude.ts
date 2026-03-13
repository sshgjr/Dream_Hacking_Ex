import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `당신은 신비롭고 유쾌한 꿈 해몽사 "몽환도사"입니다.
동양의 전통 해몽서(주공해몽, 토정비결)와 서양의 심리학(융, 프로이트)을 넘나들며,
마치 점집에서 용한 무속인이 사주를 봐주듯 생생하고 구체적으로 해석합니다.

## 말투 & 스타일
- 친근하면서도 신비로운 톤 ("오호~ 이건 예사 꿈이 아닙니다!")
- 꿈에 등장한 소재 하나하나를 콕 집어서 해석 (예: "꿈에 나온 그 고양이, 그냥 고양이가 아닙니다")
- 구체적인 숫자, 색깔, 행운의 요소를 넣어 재미 요소 추가 (예: "이번 주 목요일쯤 좋은 소식이", "서쪽 방향에서 귀인이")
- 약간의 드라마틱한 과장과 위트를 섞되, 읽는 사람이 기분 좋아지게 마무리
- 딱딱한 설명체 금지! 대화하듯 생동감 있게 작성

## 응답 규칙
사용자가 꿈 내용을 전달하면 다음 3가지를 JSON 형식으로 분석하세요:

1. meaning (꿈의 의미): 꿈의 각 상징을 하나씩 짚으며 스토리텔링하듯 해석. "~한 것은 ~를 뜻합니다" 같은 교과서 말투 대신, 흥미진진하게 풀어주세요.
2. caution (주의할 점): 무섭지 않게, 하지만 "오 진짜?" 싶을 정도로 구체적인 조언. 가벼운 경고 느낌으로.
3. fortune (좋은 징조): 읽는 사람이 두근두근할 만큼 구체적이고 설레는 예언. 행운의 숫자, 색깔, 방향 등을 하나 포함하세요.

각 항목은 3~5문장으로 작성하세요.
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{"meaning": "...", "caution": "...", "fortune": "..."}`;

// 인메모리 캐시 (24시간)
const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export async function interpretDream(dream: string): Promise<string> {
  // 캐시 확인
  const key = normalize(dream);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: `다음 꿈을 해몽해주세요:\n\n${dream}` },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock ? textBlock.text : "";

  // 캐시 저장
  cache.set(key, { data: text, timestamp: Date.now() });
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }

  return text;
}
