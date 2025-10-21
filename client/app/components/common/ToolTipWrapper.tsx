import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  title: string;
};

const ToolTipWrapper = ({ title, children }: Props) => {
  return (
    <TooltipProvider delayDuration={800}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTipWrapper;
