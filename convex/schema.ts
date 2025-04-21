import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("users"),
        joinCode: v.optional(v.string()),
    }),
    members: defineTable({
        userId: v.id("users"),
        workspaceId: v.id("workspaces"),
        role: v.union(v.literal("admin"), v.literal("member"))
    })
        .index("by_user_id", ["userId"])
        .index("by_workspace_id", ["workspaceId"])
        .index("by_workspace_id_user_id", ["workspaceId", "userId"]),

    channels: defineTable({
        name: v.string(),
        workspaceId: v.id("workspaces")
    })
        .index("by_workspace_id", ["workspaceId"]),
    conversations: defineTable({
        workspaceId: v.id("workspaces"),
        memberOneId: v.id("members"),
        memberTwoId: v.id("members"),
    })
        .index("by_workspace_id", ["workspaceId"]),
    messages: defineTable({
        body: v.string(),
        image: v.optional(v.id("_storage")),
        memberId: v.id("members"),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
        updatedAt: v.optional(v.number()),
    })
        .index("by_workspace_id", ["workspaceId"])
        .index("by_member_id", ["memberId"])
        .index("by_channel_id", ["channelId"])
        .index("by_conversation_id", ["conversationId"])
        .index("by_parent_message_id", ["parentMessageId"])
        .index("by_channel_id_parent_message_id_conversation_id", [
            "channelId",
            "parentMessageId",
            "conversationId"
        ]),
    reactions: defineTable({
        workspaceId: v.id("workspaces"),
        messageId: v.id("messages"),
        memberId: v.id("members"),
        value: v.string(),
    })
        .index("by_workspace_id", ["workspaceId"])
        .index("by_message_id", ["messageId"])
        .index("by_member_id", ["memberId"]),

    calls: defineTable({
        workspaceId: v.id("workspaces"),
        initiatorId: v.id("members"),
        receiverId: v.id("members"),
        status: v.union(
            v.literal("ringing"),
            v.literal("connected"),
            v.literal("ended"),
            v.literal("rejected")
        ),
        startedAt: v.number(),
        endedAt: v.optional(v.number()),
        type: v.union(v.literal("audio"), v.literal("video")),
    })
        .index("by_workspace_id", ["workspaceId"])
        .index("by_initiator_id", ["initiatorId"])
        .index("by_receiver_id", ["receiverId"])
        .index("by_initiator_id_status", ["initiatorId", "status"])
        .index("by_receiver_id_status", ["receiverId", "status"])
        .index("by_workspace_id_status", ["workspaceId", "status"]),
});

export default schema;