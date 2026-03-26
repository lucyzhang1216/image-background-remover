import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const API_KEY = process.env.REMOVE_BG_API_KEY || 'FapLRdAemxCRG6VJxeMHbA3e'

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

    // Call remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY,
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.title || `API error: ${response.status}`)
    }

    // Get the result as base64
    const resultBuffer = await response.arrayBuffer()
    const resultBase64 = Buffer.from(resultBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${resultBase64}`

    return NextResponse.json({ result: dataUrl })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
