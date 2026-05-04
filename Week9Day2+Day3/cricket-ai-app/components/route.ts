// app/api/ask/route.ts  (Next.js App Router)
// Proxies /api/ask → NestJS backend
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://cricketbackend-ashen.vercel.app';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res  = await fetch(`${BACKEND_URL}/api/ask`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy] error:', err);
    return NextResponse.json(
      { response: 'Failed to reach the backend. Is NestJS running?' },
      { status: 502 }
    );
  }
}