"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {

    const workspaceId = useWorkspaceId();

    const memberId = useMemberId();

    const { data, mutate, isPending } = useCreateOrGetConversation();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

    useEffect(() => {
        mutate({
            workspaceId,
            memberId,
        }, {
            onSuccess(data) {
                setConversationId(data);
            },
            onError(error) {
                toast.error("Failed to create or get conversation");
            }
        })
    }, [memberId, workspaceId, mutate]);

    if (isPending) {
        <div className="flex flex-col gap-y-2 items-center h-full justify-center">
            <Loader className="size-5 text-muted-foreground animate-spin" />
        </div>
    }

    if (!conversationId) {
        <div className="flex flex-col gap-y-2 items-center h-full justify-center">
            <AlertTriangle className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Conversation not found</span>
        </div>
    }

    return <Conversation id={conversationId} />
}

export default MemberIdPage;