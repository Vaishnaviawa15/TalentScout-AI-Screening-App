import { NextResponse } from "next/server"
import { generateTechnicalQuestion } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      roles,
      techStack,
      experienceLevel,
      difficultyStage,
    } = body

    // Basic validation (important for robustness)
    if (
      !roles ||
      !techStack ||
      !experienceLevel ||
      !difficultyStage
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const question = await generateTechnicalQuestion({
      roles,
      techStack,
      experienceLevel,
      difficultyStage,
    })

    return NextResponse.json({
      success: true,
      question,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
