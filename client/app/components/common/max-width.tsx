import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MaxWidth = ({ children, className }: Props) => {
  return (
    <div className={cn("xl:max-w-7xl w-full mx-auto", className)}>
      {children}
    </div>
  );
};

export default MaxWidth;
