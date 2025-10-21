import { cn } from "@/lib/utils";
import ReactSelect, { type MultiValue, type SingleValue } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

export type SelectProps<T> = {
  isMulti?: T;
  value: T extends true ? string[] : string;
  onChange?: (newValue: T extends true ? string[] : string) => void;
  onBlur?: () => void;
  options?: OptionType[];
  className?: string;
  placeholder?: string;
  isSearchable?: boolean;
};

const Select = <T extends boolean = false>({
  isMulti = false as T,
  value,
  options = [],
  onChange = () => {},
  className,
  onBlur = () => {},
  placeholder,
  isSearchable = false,
}: SelectProps<T>) => {
  const defaultVal = options.length
    ? isMulti
      ? options.filter((v) => value.includes(v.value))
      : options.find((val) => val.value === value)
    : null;

  const handleChange = (
    newVal: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    if (isMulti) {
      onChange(
        (newVal as MultiValue<OptionType>).map(
          (option) => option.value
        ) as T extends true ? string[] : string
      );
    } else {
      onChange(
        (newVal as SingleValue<OptionType>)?.value as T extends true
          ? string[]
          : string
      );
    }
  };

  return (
    <ReactSelect
      isSearchable={isSearchable}
      isMulti={isMulti}
      value={defaultVal}
      onChange={handleChange}
      onBlur={onBlur}
      options={options}
      placeholder={placeholder}
      classNames={{
        control: (state) =>
          cn(
            `!min-h-[3.2rem] !rounded-lg !border-2  !bg-background !text-foreground`,
            {
              "!border-secondary !shadow-none": state.isFocused,
              "!border-gray-300 dark:!border-gray-700": !state.isFocused,
            },
            className
          ),
        multiValue: () =>
          "px-1 py-0.5 !rounded-md font-medium text-sm !bg-primary !text-primary-foreground ",
        multiValueLabel: () => "!text-primary-foreground",
        option: ({ isFocused, isSelected }) =>
          cn(
            "px-3 py-2 cursor-pointer text-sm",
            isSelected
              ? "bg-secondary text-white"
              : isFocused
                ? "!bg-primary !text-white rounded-md"
                : "bg-white dark:bg-gray-800 text-black dark:text-white"
          ),
        menuList: () => "p-1 bg-background",
        menu: () => "bg-background",
      }}
    />
  );
};

export default Select;
