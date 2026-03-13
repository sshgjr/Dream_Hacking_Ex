import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { dream } = await request.json();

    if (!dream || dream.trim().length < 10) {
      return NextResponse.json(
        { error: "꿈 내용을 10자 이상 입력해주세요." },
        { status: 400 }
      );
    }

    const result = await model.generateContent(
      `다음 꿈을 해몽해주세요:\n\n${dream}`
    );

    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI 응답을 처리할 수 없습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Interpret API error:", error);
    return NextResponse.json(
      { error: "해몽 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
