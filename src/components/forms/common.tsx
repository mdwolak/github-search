import React, { type ComponentProps, type FC } from "react";

import classNames from "classnames";
import get from "lodash.get";
import type { FieldErrors } from "react-hook-form";

export const Asterisk = () => <span className="ml-1 text-sm font-medium text-red-500">*</span>;

export function Label(props: ComponentProps<"label"> & { asterisk?: boolean }) {
  const { asterisk, children, ...rest } = props;
  return (
    <label
      className={classNames("block text-sm font-medium text-gray-700", props.className)}
      {...rest}>
      {children}
      {asterisk && <Asterisk />}
    </label>
  );
}

export function Description(props: ComponentProps<"div"> & { description: string }) {
  return (
    <div className={"inline text-gray-500"}>
      <span>{props.description}</span>
    </div>
  );
}

export function FieldError({ error }: { error: string }) {
  return (
    <span role="alert" aria-label={error} className="text-sm text-red-500">
      {error}
    </span>
  );
}

export const getFieldError = (errors: FieldErrors, fieldName: string) => {
  return get(errors, fieldName);
};

/* Field wrapper for input elements */
export type FieldWrapperProps = {
  id: string;
  label: string | React.ReactNode;
  control: React.ReactNode;
  error: string | React.ReactNode;
  asterisk?: boolean;
};

export const DefaultWrap: FC<FieldWrapperProps> = ({ id, label, control, error, asterisk }) => {
  return (
    <>
      <div>
        {typeof label === "string" ? (
          <Label htmlFor={id} asterisk={asterisk}>
            {label}
          </Label>
        ) : (
          label
        )}
        <div className="mt-2">
          {control}
          {typeof error === "string" ? <FieldError error={error} /> : error}
        </div>
      </div>
    </>
  );
};

const NoWrap: FC<FieldWrapperProps> = ({ id, label, control, error, asterisk }) => {
  return (
    <>
      {typeof label === "string" ? (
        <Label htmlFor={id} asterisk={asterisk}>
          {label}
        </Label>
      ) : (
        label
      )}
      {control}
      {typeof error === "string" ? <FieldError error={error} /> : error}
    </>
  );
};
