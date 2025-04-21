import { query } from "./_generated/server";
import { v } from "convex/values";

export const getActiveCalls = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const activeCall = await ctx.db
            .query("calls")
            .withIndex("by_workspace_id_status", (q) =>
                q.eq("workspaceId", workspaceId).eq("status", "connected") // Compare to 'connected' instead of 'ongoing'
            )
            .order("desc")
            .first();

        if (!activeCall) {
            return null; // No active call found
        }

        return {
            callId: activeCall._id,
            type: activeCall.type, // 'audio' or 'video'
        };
    },
});
