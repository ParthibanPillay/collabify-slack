import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Resolves the caller's membership for a channel's workspace. Null if not signed in / not a member.
const access = async (ctx: QueryCtx, channelId: Id<"channels">) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const channel = await ctx.db.get(channelId);
    if (!channel) return null;
    const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
        .unique();
    if (!member) return null;
    return { channel, member, user: await ctx.db.get(userId) };
};

// Used by the /api/token route to authorize a LiveKit token.
export const me = query({
    args: { channelId: v.id("channels") },
    handler: async (ctx, { channelId }) => {
        const a = await access(ctx, channelId);
        return a && { channelName: a.channel.name, userId: a.member.userId, userName: a.user?.name ?? "Member" };
    },
});

// Upsert; also serves as the heartbeat.
export const join = mutation({
    args: { channelId: v.id("channels") },
    handler: async (ctx, { channelId }) => {
        const a = await access(ctx, channelId);
        if (!a) throw new Error("Unauthorized");
        const row = await ctx.db
            .query("huddleParticipants")
            .withIndex("by_channel_id_member_id", (q) =>
                q.eq("channelId", channelId).eq("memberId", a.member._id))
            .unique();
        if (row) return ctx.db.patch(row._id, { lastSeen: Date.now() });
        await ctx.db.insert("huddleParticipants", {
            workspaceId: a.channel.workspaceId,
            channelId,
            memberId: a.member._id,
            lastSeen: Date.now(),
        });
    },
});

export const leave = mutation({
    args: { channelId: v.id("channels") },
    handler: async (ctx, { channelId }) => {
        const a = await access(ctx, channelId);
        if (!a) return;
        const row = await ctx.db
            .query("huddleParticipants")
            .withIndex("by_channel_id_member_id", (q) =>
                q.eq("channelId", channelId).eq("memberId", a.member._id))
            .unique();
        if (row) await ctx.db.delete(row._id);
    },
});

// Participants per channel for the sidebar.
export const byWorkspace = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const me = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();
        if (!me) return [];

        const rows = await ctx.db
            .query("huddleParticipants")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
            .collect();

        const byChannel: Record<string, string[]> = {};
        for (const r of rows) {
            const member = await ctx.db.get(r.memberId);
            const user = member && (await ctx.db.get(member.userId));
            (byChannel[r.channelId] ??= []).push(user?.name ?? "Member");
        }
        return Object.entries(byChannel).map(([channelId, names]) => ({ channelId, names }));
    },
});

// ponytail: heartbeat + cron prune; switch to a LiveKit webhook if exact presence matters
export const prune = internalMutation({
    args: {},
    handler: async (ctx) => {
        const cutoff = Date.now() - 60_000;
        for (const r of await ctx.db.query("huddleParticipants").collect()) {
            if (r.lastSeen < cutoff) await ctx.db.delete(r._id);
        }
    },
});
