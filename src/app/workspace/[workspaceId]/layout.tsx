"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "./sidebar";
import { Toolbar } from "./toolbar";
import WorkspaceSidebar from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-pannel";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";
import { VideoRoom } from "./video-room";
import { getActiveCalls } from "../../../../convex/activeCalls";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect, useState } from "react";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceIdLayoutProps) => {

    const { parentMessageId, profileMemberId, onClose } = usePanel();

    const showPanel = !!parentMessageId || !!profileMemberId;

    const workspaceId = useWorkspaceId();

    const [activeCall, setActiveCall] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveCalls = async () => {
            try {
                const response = await fetch(`/api/active-calls?workspaceId=${workspaceId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch active calls");
                }
                const data = await response.json();
                // Assuming the response includes the active call data
                setActiveCall(data.activeCall); 
            } catch (err:any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActiveCalls();
    }, [workspaceId]);

    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId="psp-workspace-layout">
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#5e2c5f]"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20} defaultSize={80}>
                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId ? (
                                    <Thread
                                        messageId={parentMessageId as Id<"messages">}
                                        onClose={onClose}
                                    />
                                ) : profileMemberId ? (
                                    <Profile
                                        memberId={profileMemberId as Id<"members">}
                                        onClose={onClose}
                                    />
                                ) : (
                                    <div className="flex items-center h-full justify-center">
                                        <Loader className="size-5 text-muted-foreground animate-spin" />
                                    </div>
                                )}
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
            {/* Render Video Room if there is an active video call */}
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader className="size-5 text-muted-foreground animate-spin" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center text-red-500">
                    <p>Error fetching active calls!</p>
                </div>
            ) : activeCall && activeCall.type === "video" ? (
                <VideoRoom
                    chatId={activeCall.id}
                    video={true}
                    audio={true}
                />
            ) : null}
        </div>
    );
}

export default WorkspaceLayout;