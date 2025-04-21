import { query } from "../_generated/server";
import { v } from "convex/values";

export const getByWorkspace = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        // Query the calls table for the latest connected call in the workspace
        const call = await ctx.db
            .query("calls")
            .withIndex("by_workspace_id_status", (q) =>
                q.eq("workspaceId", workspaceId).eq("status", "connected")
            )
            .order("desc") // Get the most recent call
            .first(); // Only fetch the first result

        if (!call) {
            return null; // No connected call found
        }

        return {
            callId: call._id,
            type: call.type, // video or audio
        };
    },
});
