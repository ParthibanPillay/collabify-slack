"use client";

import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  useIsSpeaking,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { DisconnectReason, type Participant } from "livekit-client";
import { useMutation } from "convex/react";
import { Loader2, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useHuddle } from "../store/use-huddle";

const VoiceTile = ({ p }: { p: Participant }) => {
  const speaking = useIsSpeaking(p);
  const name = p.name || "Member";
  return (
    <div className="flex flex-col items-center gap-1 w-16">
      <div
        className={cn(
          "size-12 rounded-full bg-[#5e2c5f] text-white font-semibold flex items-center justify-center ring-2 ring-transparent transition",
          speaking && "ring-green-500"
        )}
      >
        {name[0]?.toUpperCase()}
      </div>
      <span className="text-xs text-white truncate max-w-full">{p.isLocal ? "You" : name}</span>
    </div>
  );
};

const VoiceGrid = () => (
  <div className="flex flex-wrap justify-center gap-3 p-3">
    {useParticipants().map((p) => <VoiceTile key={p.identity} p={p} />)}
  </div>
);

// Remounted per channel (key), so switching huddles leaves the old one.
const Session = ({ channelId, onEnd }: { channelId: Id<"channels">; onEnd: () => void }) => {
  const join = useMutation(api.huddles.join);
  const leave = useMutation(api.huddles.leave);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/token?channelId=${channelId}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Failed to join");
        setToken(d.token);
        setName(d.channelName);
      })
      .catch((e) => setError(e.message));
  }, [channelId]);

  // Presence: join, heartbeat every 20s, leave on unmount. The server prunes rows after 60s without a ping.
  useEffect(() => {
    if (!token) return;
    join({ channelId });
    const t = setInterval(() => join({ channelId }), 20_000);
    return () => {
      clearInterval(t);
      leave({ channelId });
    };
  }, [token, channelId, join, leave]);

  return (
    <div className={"fixed bottom-4 left-4 z-50 w-72 rounded-lg bg-zinc-900 shadow-xl overflow-hidden"}>
      <div className="px-3 py-2 text-sm text-white border-b border-white/10 truncate"># {name || "…"}</div>
      {error ? (
        <div className="p-3 text-sm text-red-400">
          {error} <button className="underline ml-2" onClick={onEnd}>Close</button>
        </div>
      ) : !token ? (
        <div className="p-6 flex justify-center"><Loader2 className="size-5 animate-spin text-white" /></div>
      ) : (
        <LiveKitRoom
          data-lk-theme="default"
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          token={token}
          connect
          audio
          // Client-initiated disconnects include React strict-mode remounts in dev; only server-side drops end the huddle.
          onDisconnected={(reason) => reason !== DisconnectReason.CLIENT_INITIATED && onEnd()}
          onError={(e) => setError(e.message)}
        >
          <VoiceGrid />
          <RoomAudioRenderer />
          <div className="flex items-center justify-center gap-2 pb-2">
            <ControlBar
              variation="minimal"
              controls={{ camera: false, screenShare: false, chat: false, settings: false, leave: false }}
              className="border-0 !p-0"
            />
            <button onClick={onEnd} title="Leave" className="size-9 rounded-md bg-red-600 hover:bg-red-500 text-white flex items-center justify-center">
              <PhoneOff className="size-4" />
            </button>
          </div>
        </LiveKitRoom>
      )}
    </div>
  );
};

export const HuddleDock = () => {
  const [huddle, setHuddle] = useHuddle();
  if (!huddle) return null;
  return (
    <Session
      key={huddle.channelId}
      channelId={huddle.channelId as Id<"channels">}
      onEnd={() => setHuddle(null)}
    />
  );
};
