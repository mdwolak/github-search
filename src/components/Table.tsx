import type { ComponentProps } from "react";
import React from "react";

import { classNames } from "~/lib/common";

interface TableCaptionProps {
  title: string;
  children: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

export const TableCaption = ({ title, children, buttonText, onButtonClick }: TableCaptionProps) => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
        {children && <p className="mt-2 text-sm text-gray-700">{children}</p>}
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

type TableCellProps = ComponentProps<"td"> & {
  screen?: "all" | "sm" | "md" | "lg";
  first?: boolean;
  last?: boolean;
  children: React.ReactNode;
};

export const THeader = ({
  screen = "all",
  first = false,
  last = false,
  children,
  className,
  ...props
}: TableCellProps) => {
  return (
    <th
      scope="col"
      className={classNames(
        "py-3.5 text-left text-sm font-semibold text-gray-900",
        first ? "pl-4 pr-3 sm:pl-0" : last ? "relative pl-3 pr-4 sm:pr-0" : "px-3",
        screen == "sm" && "hidden sm:table-cell",
        screen == "md" && "hidden md:table-cell",
        screen == "lg" && "hidden lg:table-cell",
        className
      )}
      {...props}>
      {children}
    </th>
  );
};

export const TCell = ({
  screen = "all",
  first = false,
  last = false,
  children,
  className,
  ...props
}: TableCellProps) => {
  return (
    <td
      className={classNames(
        "whitespace-nowrap py-4 text-sm",
        first
          ? "pl-4 pr-3 font-medium text-gray-900 sm:pl-0"
          : last
          ? "pl-3 pr-4 text-right font-medium  sm:pr-0"
          : "px-3 text-gray-500",
        screen == "sm" && "hidden sm:table-cell",
        screen == "lg" && "hidden lg:table-cell",
        className
      )}
      {...props}>
      {children}
    </td>
  );
};
