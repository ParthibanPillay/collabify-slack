import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";

interface ProfileProps {
    memberId: Id<"members">,
    onClose: () => void,
};

export const Profile = ({
    memberId,
    onClose
}: ProfileProps) => {

    const { data: member, isLoading: iLoadingMember } = useGetMember({ id: memberId });

    if (loadingMessage || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 items-center h-full justify-center">
                    <Loader className="size-5 text-muted-foreground animate-spin" />
                </div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 items-center h-full justify-center">
                    <AlertTriangleIcon className="size-5 text-muted-foreground " />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            Profile
        </div>
    )
};