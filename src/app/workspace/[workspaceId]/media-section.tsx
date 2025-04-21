"use client";

import { Button } from "@/components/ui/button";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { FaCaretRight, FaVideo, FaPhone } from "react-icons/fa";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface MediaSectionProps {
    label: string;
    hint: string;
    onNew?: () => void;
}

export const MediaSection = ({
    label,
    hint,
    onNew
}: MediaSectionProps) => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeRoom, setActiveRoom] = useState<'video' | 'voice' | null>(null);

    const router = useRouter();

    // Toggle section expansion
    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Toggle room activation
    const toggleRoom = (type: 'video' | 'voice') => {
        if (activeRoom === type) {
            // Deactivate if already active
            setActiveRoom(null);
        } else {
            // Activate the selected room type
            setActiveRoom(type);
        }
    };

    const handleVideoClick = () => {
        router.push(`/workspace/${workspaceId}/call/${workspaceId}?type=video`);
    };

    const handleVoiceClick = () => {
        router.push(`/workspace/${workspaceId}/call/${workspaceId}?type=voice`);
    };

    return (
        <div className="flex flex-col mt-3 px-2">
            {/* Section header with expansion toggle */}
            <div className="flex items-center px-3.5 group">
                <Button
                    onClick={toggleExpand}
                    variant="transparent"
                    className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
                >
                    <FaCaretRight className={cn(
                        "size-4 transition-transform",
                        isExpanded && "rotate-90"
                    )} />
                </Button>
                <Button
                    variant="transparent"
                    size='sm'
                    className="group px-1.5 text-[#f9edffcc] h-[28px] justify-center items-center overflow-hidden"
                >
                    <span className="truncate">{label}</span>
                </Button>

                {/* Room type buttons */}
                {isExpanded && (
                    <div className="ml-auto flex items-center space-x-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => toggleRoom('video')}
                                        size="icon"
                                        variant={activeRoom === 'video' ? 'default' : 'ghost'}
                                        className={cn(
                                            "size-6 p-0.5",
                                            activeRoom === 'video' ? 'bg-green-500/20 text-green-500' : 'text-[#f9edffcc]'
                                        )}
                                    >
                                        <FaVideo className="size-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Video Call</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() => toggleRoom('voice')}
                                        size="icon"
                                        variant={activeRoom === 'voice' ? 'default' : 'ghost'}
                                        className={cn(
                                            "size-6 p-0.5",
                                            activeRoom === 'voice' ? 'bg-blue-500/20 text-blue-500' : 'text-[#f9edffcc]'
                                        )}
                                    >
                                        <FaPhone className="size-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Voice Call</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Render MediaRoom based on active state */}
            {isExpanded && activeRoom && workspaceId && channelId && (
                <div className="mt-2 px-1">
                    <Button
                        onClick={activeRoom === 'video' ? handleVideoClick : handleVoiceClick}
                        className={cn(
                            "bg-zinc-800 text-white px-3 py-1 rounded hover:bg-zinc-700 transition",
                            activeRoom === 'voice' && 'bg-blue-600 hover:bg-blue-500'
                        )}
                    >
                        {activeRoom === 'video' ? 'Start Video Call' : 'Start Voice Call'}
                    </Button>
                </div>
            )}

            {/* Show hint when no room is active */}
            {isExpanded && !activeRoom && (
                <div className="mt-2 px-4 py-2 text-xs text-[#f9edff99]">
                    <p>{hint || 'Click on video or voice icons to start a call'}</p>
                </div>
            )}
        </div>
    );
}
