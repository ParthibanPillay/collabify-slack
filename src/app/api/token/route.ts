import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// One LiveKit room per channel (room name = channelId). Only workspace members get a token.
export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId") as Id<"channels"> | null;
  if (!channelId) return NextResponse.json({ error: "Missing channelId" }, { status: 400 });

  const token = await convexAuthNextjsToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const me = await fetchQuery(api.huddles.me, { channelId }, { token });
    if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const at = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
      identity: me.userId,
      name: me.userName,
    });
    at.addGrant({ roomJoin: true, room: channelId, canPublish: true, canSubscribe: true });

    return NextResponse.json({ token: await at.toJwt(), channelName: me.channelName });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
