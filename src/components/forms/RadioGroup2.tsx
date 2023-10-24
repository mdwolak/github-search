import { type ReactNode } from "react";

import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";

type Option = {
  name: string;
  children: ReactNode;
};

type RadioGroupProps = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
};

export const RadioGroup = ({ options, value, onChange }: RadioGroupProps) => {
  const handleChange = (value: Option) => {
    onChange(value);
  };

  return (
    <HeadlessRadioGroup value={value} onChange={handleChange}>
      {options.map((option) => (
        <RadioGroupOption key={option.name} option={option} />
      ))}
    </HeadlessRadioGroup>
  );
};

type RadioGroupOptionProps = {
  option: Option;
};

export const RadioGroupOption = ({ option }: RadioGroupOptionProps) => {
  return (
    <HeadlessRadioGroup.Option
      value={option}
      className={({ checked }) =>
        [
          checked ? "z-10 border-indigo-200 bg-indigo-50" : "border-gray-200",
          "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6",
        ].join(" ")
      }>
      {({ active, checked }) => (
        <>
          <span className="flex items-center text-sm">
            <span
              className={[
                checked ? "border-transparent bg-indigo-600" : "border-gray-300 bg-white",
                active ? "ring-2 ring-indigo-600 ring-offset-2" : "",
                "flex h-4 w-4 items-center justify-center rounded-full border",
              ].join(" ")}
              aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <HeadlessRadioGroup.Label
              as="span"
              className={[checked ? "text-indigo-900" : "text-gray-900", "ml-3 font-medium"].join(
                " "
              )}>
              {option.name}
            </HeadlessRadioGroup.Label>
          </span>
          <HeadlessRadioGroup.Description
            as="span"
            className={[
              checked ? "text-indigo-700" : "text-gray-500",
              "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right",
            ].join(" ")}>
            {option.children}
          </HeadlessRadioGroup.Description>
        </>
      )}
    </HeadlessRadioGroup.Option>
  );
};
