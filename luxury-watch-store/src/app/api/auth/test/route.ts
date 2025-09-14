import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      message: "Auth API is working",
      timestamp: new Date().toISOString(),
      env: {
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        url: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Auth API test failed",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}