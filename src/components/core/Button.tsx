import type { ComponentPropsWithRef, ComponentPropsWithoutRef } from "react";
import { type Ref, forwardRef } from "react";

import classNames from "classnames";

import { Spinner } from "~/components/core/Spinner";

const variants = {
  primary:
    "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 enabled:hover:bg-indigo-500",
  secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50",
  destructive: "bg-red-600 text-white border-transparent enabled:hover:opacity-80",
};

/**
 * Size-sensitive classes
 */
const textWithOptionalIconClasses = {
  xs: "px-2 py-1 text-xs", //fits compact table, inline text, bulleted lists
  sm: "px-2.5 py-1.5 text-sm", //fits standard table
  default: "px-3 py-2 text-sm", //default action button
  lg: "px-4 py-3 text-md", //big conspicuous button
};

const iconOnlyClasses = {
  xs: "p-1",
  sm: "p-1.5",
  default: "p-2",
  lg: "p-3.5",
};

const iconSizes = {
  xs: "h-2.5 w-2.5",
  sm: "h-4 w-4",
  default: "h-4 w-4",
  lg: "h-5 w-5",
};

type SVGComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type ButtonProps = ComponentPropsWithRef<"button"> & {
  isLoading?: boolean;
  variant?: keyof typeof variants;
  Icon?: SVGComponent | React.ElementType; //accept lucid-react icons | heroicons
  size?: keyof typeof textWithOptionalIconClasses;
  fullWidth?: boolean;
  rounded?: boolean;
};

export const Button = forwardRef(function Button(
  {
    children,
    className,
    type = "button",
    isLoading,
    disabled,
    variant = "primary",
    Icon,
    size = "default",
    fullWidth = false,
    rounded = false,
    ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  disabled = disabled || isLoading;
  const iconClass = `${children ? "mr-2 " : ""}${iconSizes[size]}`;

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        fullWidth && "flex w-full justify-center",
        (Icon || isLoading) && "inline-flex items-center", //items-center centers icon horizontally
        rounded ? "rounded-full" : "rounded-md",
        "font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60", //font-semibold border
        children ? textWithOptionalIconClasses[size] : iconOnlyClasses[size],
        variants[variant],
        className
      )}
      disabled={disabled}
      {...props}>
      {isLoading ? (
        <>
          <Spinner className={iconClass} aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {/* <span >{icon}</span> */}
          {Icon && <Icon className={iconClass} aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
});

type IconButtonProps = ComponentPropsWithoutRef<"button"> & {
  Icon: SVGComponent | React.ElementType;
  srText: string;
  className?: string;
};
export const IconButton = ({ Icon, srText, className, ...props }: IconButtonProps) => {
  return (
    <button
      type="button"
      className={classNames("text-gray-400 hover:text-gray-500", className)}
      {...props}>
      <Icon className="h-6 w-6" aria-hidden="true" />
      <span className="sr-only">{srText}</span>
    </button>
  );
};

export default IconButton;
