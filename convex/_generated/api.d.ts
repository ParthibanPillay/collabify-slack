/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activeCalls from "../activeCalls.js";
import type * as auth from "../auth.js";
import type * as calls_getByworkspace from "../calls/getByworkspace.js";
import type * as channels from "../channels.js";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as reactions from "../reactions.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activeCalls: typeof activeCalls;
  auth: typeof auth;
  "calls/getByworkspace": typeof calls_getByworkspace;
  channels: typeof channels;
  conversations: typeof conversations;
  http: typeof http;
  members: typeof members;
  messages: typeof messages;
  reactions: typeof reactions;
  upload: typeof upload;
  users: typeof users;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
