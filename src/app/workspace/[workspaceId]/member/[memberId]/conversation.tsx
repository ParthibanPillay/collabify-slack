import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Header } from "./header";
import { Loader } from "lucide-react";
import { ChatInput } from "./chat-input";
import { MesesageList } from "@/components/message-list";

interface ConversationProps {
    id: Id<"conversations">;
};

export const Conversation = ({ id }: ConversationProps) => {

    const memberId = useMemberId();

    const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });

    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });
    console.log(results);

    if (memberLoading || status === "LoadingFirstPage") {
        <div className="flex flex-col gap-y-2 items-center h-full justify-center">
            <Loader className="size-5 text-muted-foreground animate-spin" />
        </div>
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                memberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => { }}
            />
            <MesesageList
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput
                placeholder={`Message ${member?.user.name}`}
                conversationId={id}
            />
        </div>
    )
}