"use client";

import { useRouter } from 'next/navigation';
import { VideoRoom } from '../../video-room';
import { redirect } from 'next/navigation';
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useSearchParams } from 'next/navigation';

interface CallPageProps {
    params: {
        workspaceId: string;
        channelId: string;
    };
}

export default function CallPage({ params }: CallPageProps) {

    const searchParams = useSearchParams();
    const callType = searchParams.get('type'); // 'video' or 'voice'

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const { channelId } = params;

    if (!channelId) {
        return redirect('/');
    }

    return (
        <div className="h-screen w-screen bg-black text-white">
            <VideoRoom chatId={channelId} video={true} audio={true} />
            <button
                onClick={() => router.push(`/workspace/${workspaceId}`)}
                className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded"
            >
                Back
            </button>
        </div>
    );
}
