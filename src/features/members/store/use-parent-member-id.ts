import { useQueryState } from "nuqs";

export const useParentMemberId = () => {
    return useQueryState("profileMemberId");
}