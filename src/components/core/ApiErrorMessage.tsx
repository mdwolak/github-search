import { useState } from "react";

import { Alert } from "~/components/core";

export const ApiErrorMessage = ({
  error,
  visible = true,
  header = "Oops!",
}: {
  error: { message: string } | null;
  visible?: boolean;
  header?: string;
}) => {
  const [expand, setExpand] = useState(false);

  if (error) {
    console.log(error.message);
    if (visible)
      return (
        <Alert severity="error">
          {header && <strong className="font-bold">{header} </strong>}
          {error.message}
          {location.hostname === "localhost" && (
            <div>
              <a
                className="mb-2 block cursor-pointer text-indigo-600 hover:text-indigo-500 hover:underline"
                onClick={() => setExpand(!expand)}>
                {expand ? "Collapse" : "Expand"}
              </a>
              {expand && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            </div>
          )}
        </Alert>
      );
  }

  return null;
};
