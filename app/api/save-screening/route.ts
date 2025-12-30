import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const filePath = path.join(process.cwd(), "data", "screenings.json")

    // Ensure folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true })

    const newScreening = {
      ...data,
      submittedAt: new Date().toISOString(),
    }

    // Always overwrite with latest screening
    fs.writeFileSync(
      filePath,
      JSON.stringify([newScreening], null, 2)
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save screening" },
      { status: 500 }
    )
  }
}
