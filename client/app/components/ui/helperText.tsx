import { cn } from "@/lib/utils";

type HelperTextProps = {
  error?: boolean;
  text?: string;
  className?: string;
};

const HelperText = ({ error = false, text, className }: HelperTextProps) => {
  if (!text) return <></>;
  return (
    <p
      className={cn(
        `ml-2 text-xs text-start w-full`,
        error ? "text-red-400" : "text-gray-500",
        className
      )}
    >
      {text}
    </p>
  );
};

export default HelperText;
