import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  error?: boolean;
  paperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      paperClassName = "",
      type,
      error,
      LeftIcon,
      RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex w-full items-center overflow-hidden rounded-lg border focus-within:border-primary focus:border-primary transform transition-all duration-300 gap-1 bg-background text-foreground",
          paperClassName
        )}
      >
        {LeftIcon && <span className="ml-3">{LeftIcon}</span>}

        <input
          type={type}
          onKeyDown={(evt) => {
            if (type === "number") {
              ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault();
            }
          }}
          className={cn(
            `flex h-12 file:h-[96%] w-full px-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#737373] focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 2xl:text-[16px] file:text-gray-400 text-black dark:text-white  placeholder:text-sm -mt-1 bg-background`,
            className
          )}
          ref={ref}
          {...props}
        />
        {RightIcon && <span className="mr-3">{RightIcon}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
