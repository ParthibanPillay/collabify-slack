// src/app/api/token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json({ error: "Missing room or username" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: username,
    name: username,
  });

  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();

  return NextResponse.json({ token: jwt });
}
