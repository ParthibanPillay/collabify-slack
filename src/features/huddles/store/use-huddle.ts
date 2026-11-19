import { atom, useAtom } from "jotai";

export type Huddle = { channelId: string } | null;

const huddleState = atom<Huddle>(null);

export const useHuddle = () => useAtom(huddleState);
