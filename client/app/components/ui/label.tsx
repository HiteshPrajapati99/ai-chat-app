import { cn } from "@/lib/utils";

type LabelProps = {
  error?: boolean;
  label: string;
  className?: string;
  htmlFor?: string;
};

const Label = ({ error = false, label, className, htmlFor }: LabelProps) => {
  return (
    <label
      className={cn(
        "mb-0.5 ml-1 flex justify-start w-full text-xs",
        { "text-red-400": error },
        className
      )}
      htmlFor={htmlFor}
    >
      {label}
    </label>
  );
};

export default Label;
