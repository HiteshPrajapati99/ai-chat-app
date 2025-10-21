import { Controller, useFormContext } from "react-hook-form";
import HelperText from "../ui/helperText";
import Label from "../ui/label";
import Select from "../ui/multi-select";

interface OptionType {
  value: string;
  label: string;
}

type FormProps = {
  name: string;
  label?: string;
  isMulti?: boolean;
  value?: string;
  options: OptionType[];
  className?: string;
  placeholder?: string;
  isSearchable?: boolean;
};

const FormSelect = ({
  className,
  isMulti,
  options,
  name,
  label,
  placeholder,
  isSearchable,
  value,
}: FormProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <Label
            htmlFor={name}
            label={label || ""}
            error={Boolean(fieldState.error)}
          />

          <Select
            value={value || field.value}
            onChange={(newVal) => field.onChange(newVal)}
            className={className}
            isMulti={isMulti}
            onBlur={field.onBlur}
            options={options}
            placeholder={placeholder}
            isSearchable={isSearchable}
          />

          <HelperText
            error={Boolean(fieldState.error)}
            text={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
};

export default FormSelect;
