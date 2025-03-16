import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { useToggle } from "react-use";

interface MemberSectionProps {
    children: React.ReactNode;
    label: string;
    hint: string;
    onNew?: () => void;
}

export const MemberSection = ({
    children,
    label,
    hint,
    onNew
}: MemberSectionProps) => {
    const [on, toggle] = useToggle(true);
    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center px-3.5 group">
                <Button
                    onClick={toggle}
                    variant="transparent"
                    className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6">
                    <FaCaretRight className={cn("size-4 transition-transform",
                        on && "rotate-90"
                    )} />
                </Button>
                <Button
                    variant="transparent"
                    size='sm'
                    className="group px-1.5 text-[#f9edffcc] h-[28px] justify-center items-center overflow-hidden">
                    <span className="truncate">{label}</span>
                </Button>
            </div>
            {on && children}
        </div>
    )
}