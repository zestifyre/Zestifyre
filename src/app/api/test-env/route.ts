import { NextResponse } from 'next/server';

export async function GET() {
  const apifyToken = process.env.APIFY_TOKEN;
  
  return NextResponse.json({
    success: true,
    apifyToken: apifyToken ? `${apifyToken.substring(0, 10)}...` : 'NOT_FOUND',
    hasToken: !!apifyToken,
    envKeys: Object.keys(process.env).filter(key => key.includes('APIFY'))
  });
}

