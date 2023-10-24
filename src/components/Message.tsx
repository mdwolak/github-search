import React, { type FC } from "react";

type IMessageProps = {
  children: React.ReactNode;
};
const Message = ({ children }: IMessageProps) => {
  return (
    <div
      className="mx-auto flex h-40 max-w-3xl items-center justify-center rounded-lg bg-teal-100 px-4 py-3 shadow-md"
      role="alert">
      <span className="text-xl font-semibold text-teal-500">{children}</span>
    </div>
  );
};

export default Message;
