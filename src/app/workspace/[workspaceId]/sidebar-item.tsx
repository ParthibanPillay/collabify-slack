import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Headphones, LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps} from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarItemVariants = cva(
    "flex item-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants : {
            variant : {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90"
            },
        },
        defaultVariants: {
            variant: 'default'
        }
    },
)

interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof SidebarItemVariants>["variant"];
    huddle?: string[];
};

export const SidebarItem = ({
    label,id,icon: Icon,variant,huddle
}:SidebarItemProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <Button
        variant="transparent"
        size="sm"
        className={cn(SidebarItemVariants({variant}))}
        asChild
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
            <Icon className="size-3.5 mr-1 shrink-0"/>
            <span className="text-sm truncate">{label}</span>
            {!!huddle?.length && (
                <span title={huddle.join(", ")} className="ml-auto flex items-center gap-0.5 text-xs text-green-400">
                    <Headphones className="size-3" />{huddle.length}
                </span>
            )}
            </Link>
        </Button>
    )
}