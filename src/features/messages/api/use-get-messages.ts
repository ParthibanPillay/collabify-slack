import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;

interface useGetMessagesProps {
    channelId?: Id<"channels">,
    conversationId?: Id<"conversations">,
    parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({
    channelId,
    conversationId,
    parentMessageId
}: useGetMessagesProps) => {

    //to get proper Id's and not null values
    const queryArgs: any = {};
    if (channelId) queryArgs.channelId = channelId;
    if (conversationId) queryArgs.conversationId = conversationId;
    if (parentMessageId) queryArgs.parentMessageId = parentMessageId;

    const { results, status, loadMore } = usePaginatedQuery(
        api.messages.get,
        queryArgs,
        { initialNumItems: BATCH_SIZE },
    );

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE),
    };
};