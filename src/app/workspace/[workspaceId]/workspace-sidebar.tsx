import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";
import { MemberSection } from "./member-section";
import { MediaSection } from "./media-section";

const WorkspaceSidebar = () => {
    const memberId = useMemberId();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = UseGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white" />
            </div>
        )
    }

    if (!workspace || !member) {
        return (
            <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
                <AlertTriangle className="size-5 text-white" />
                <p className="text-white text-sm">workspace not found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col bg-[#5e2c5f] h-full">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"
                />
                <SidebarItem
                    label="drafts & sent"
                    icon={SendHorizonal}
                    id="drafts"
                />
            </div>
            <WorkspaceSection
                label="channels"
                hint="New channel"
                onNew={member.role === "admin" ? () => setOpen(true) : undefined}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
            <MemberSection
                label="Direct Messages"
                hint="New direct messages"
                onNew={() => { }}
            >
                {members?.map((item) => (
                    <UserItem
                        image={item.user.image}
                        key={item._id}
                        id={item._id}
                        label={item.user.name}
                        variant={item._id === memberId ? "active" : "default"} />
                ))}
            </MemberSection>
            <MediaSection
            label="Meetings"
            hint="create video/voice calls"
            onNew={()=>{}}/>
        </div>
    );
}

export default WorkspaceSidebar;