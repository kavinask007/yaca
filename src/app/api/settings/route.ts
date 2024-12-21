import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { llmProvider, temperature, systemMessage, apiKey } = body

    // Update settings in the database
    const updatedSettings = await prisma.settings.upsert({
      where: { id: 1 }, // Assuming there's only one settings record
      update: {
        llmProvider,
        temperature,
        systemMessage,
        apiKey,
      },
      create: {
        llmProvider,
        temperature,
        systemMessage,
        apiKey,
      },
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Error updating settings" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Error fetching settings" }, { status: 500 })
  }
}

