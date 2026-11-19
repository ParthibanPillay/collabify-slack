# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No test runner is configured. Vercel installs with `npm install --legacy-peer-deps` (`vercel.json`), and `package-lock.json` is the lockfile that matters (`bun.lockb` is also present).

- `npm run dev` runs the Next.js dev server. Run `npx convex dev` in a second terminal for the backend (the README says `bunx convex dev`).
- `npm run build` runs `next build`, then `postbuild` runs `npx convex deploy`. A local build therefore pushes the backend to the linked Convex deployment.
- `npm run lint` runs `next lint`. `npx tsc --noEmit` type-checks.
- `preinstall` runs `npx npm-force-resolutions` (pins `cmdk/react` to React 19 via `resolutions`).

## Environment

`.env*` is gitignored. The README only documents `CONVEX_DEPLOYMENT`. The code also reads:
- `CONVEX_SITE_URL` in `convex/auth.config.ts`.
- GitHub and Google OAuth credentials, expected by `@auth/core` for the providers in `convex/auth.ts`.

## Architecture

**Backend is Convex only (`convex/`).** One file per domain: `workspaces`, `members`, `channels`, `conversations`, `messages`, `reactions`, `upload`, `users`. `schema.ts` is the source of truth for tables and indexes. `_generated/` is auto-generated, so don't edit it. Query by index, using the names in `schema.ts` (e.g. `by_workspace_id_user_id`).

**Data model.** Everything hangs off `workspaces`. A user's membership is a `members` row (`role` is `admin` or `member`), and messages, reactions, and DMs reference `members`, not `users`. `messages` is one table for three contexts: channel messages (`channelId`), DMs (`conversationId`) and thread replies (`parentMessageId`).

**Auth.** `@convex-dev/auth` with Password, GitHub and Google providers (`convex/auth.ts`, routes registered in `convex/http.ts`). `src/middleware.ts` redirects unauthenticated users to `/auth` and authenticated users away from it. The matcher also covers `/api` routes.

**Frontend (`src/`).** The App Router tree is `app/workspace/[workspaceId]/{channel/[channelId], member/[memberId]}`. Domain code lives in `src/features/<domain>/{api,components,store}`:
- `api/use-*.ts` are thin hooks around `useQuery`, `useMutation` and `usePaginatedQuery` for the matching Convex function. Follow this pattern for new backend calls. Return types derive from `api.<module>.<fn>._returnType`.
- `store/` holds Jotai atoms for client UI state.
- `src/hooks/use-*-id.ts` read route/query params (`nuqs` is used for thread/panel state).
- Imports use the `@/*` alias for `src/*`. Convex's generated API is imported by relative path from `convex/_generated`.
