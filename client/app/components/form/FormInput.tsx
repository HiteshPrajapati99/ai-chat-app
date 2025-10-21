import React, { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import Label from "../ui/label";
import HelperText from "../ui/helperText";

type FormInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  RightIcon?: ReactNode;
  LeftIcon?: ReactNode;
  classes?: {
    inputRoot?: string;
    label?: string;
    helperText?: string;
    inputContainer?: string;
  };
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  label = "",
  placeholder,
  type = "text",
  classes,
  LeftIcon,
  RightIcon,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="w-full">
          <Label
            htmlFor={name}
            label={label}
            error={Boolean(fieldState.error)}
            className={classes?.label}
          />

          <Input
            {...field}
            type={type}
            placeholder={placeholder || ""}
            className={classes?.inputRoot}
            paperClassName={classes?.inputContainer}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            LeftIcon={LeftIcon}
            RightIcon={RightIcon}
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

export default FormInput;
