import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("prune stale huddle participants", { minutes: 1 }, internal.huddles.prune);
export default crons;
