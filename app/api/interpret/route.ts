import { NextRequest, NextResponse } from "next/server";
import { interpretDream } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { dream } = await request.json();

    if (!dream || dream.trim().length < 10) {
      return NextResponse.json(
        { error: "꿈 내용을 10자 이상 입력해주세요." },
        { status: 400 }
      );
    }

    // 실제 API 호출 느낌을 위한 인위적 지연 (1~2초)
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const result = await interpretDream(dream);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interpret API error:", error);
    return NextResponse.json(
      { error: "해몽 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
