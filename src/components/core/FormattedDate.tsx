import React from "react";

import { format as fnsFormat } from "date-fns";

type FormattedDateProps = {
  date: Date;
  format?: string;
};

export const FormattedDate = ({ date, format = "PPP" }: FormattedDateProps) => {
  const formattedDate = fnsFormat(date, format);

  return <span className="date">{formattedDate}</span>;
};
