'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LiveKitRoom, ControlBar } from '@livekit/components-react'; // Importing necessary components for audio/video call
import '@livekit/components-styles';

interface VoiceRoomProps {
    chatId: string;
    audio: boolean;
    video: boolean;
}

export const VoiceRoom = ({ chatId, audio, video }: VoiceRoomProps) => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const name = "Member";

        (async () => {
            try {
                const resp = await fetch(`/api/token?room=${chatId}&username=${name}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [chatId]);

    if (token === "") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className='text-xs text-zinc-500'>Loading...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}  // Disable video track
            audio={audio}  // Enable audio track
        >
            {/* The ControlBar provides basic video/audio control options */}
            <ControlBar />
        </LiveKitRoom>
    );
};
