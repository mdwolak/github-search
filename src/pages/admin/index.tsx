import { useState } from "react";

import { RadioGroup } from "~/components/forms/RadioGroup";
import { getLayout } from "~/components/layouts/Layout";

const options = [
  {
    value: "public",
    name: "Public access",
    description: "This project would be available to anyone who has the link",
  },
  {
    value: "private",
    name: "Private to Project Members",
    description: "Only members of this project would be able to access",
  },
  {
    value: "private_to_you",
    name: "Private to you",
    description: (
      <span>
        You <b>are</b> the only one able to access this project
      </span>
    ),
    disabled: true,
  },
];

const Example = () => {
  const [value, setValue] = useState("public");

  return (
    <>
      <RadioGroup value={value} onChange={setValue} options={options} srOnly="Privacy setting" />
    </>
  );
};
Example.getLayout = getLayout;
export default Example;
