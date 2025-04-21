'use client';

import {
    ControlBar,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
    RoomContext,
    LiveKitRoom,
    VideoConference,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MeetingProps {
    chatId: string,
    video: boolean,
    audio: boolean,
}

export const VideoRoom = ({
    chatId,
    video,
    audio
}: MeetingProps) => {
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
        })()
    }, [chatId]);

    if (token === "") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2
                    className='h-7 w-7 text-zinc-500 animate-spin my-4'
                />
                <p className='text-xs text-zinc-500'>Loading...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference className='w-full h-full'/>
        </LiveKitRoom>
    )
}