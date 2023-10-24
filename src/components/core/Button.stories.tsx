import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta = {
  title: "Core/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    //backgroundColor: { control: "color" },
  },
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * STORIES
 */
export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Primary_Loading: Story = {
  args: {
    ...Primary.args,
    isLoading: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Secondary_Loading: Story = {
  args: {
    variant: "secondary",
    isLoading: true,
  },
};

export const Secondary_Disabled: Story = {
  args: {
    variant: "secondary",
    disabled: true,
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Destructive_Loading: Story = {
  args: {
    variant: "destructive",
    isLoading: true,
  },
};

export const Destructive_Disabled: Story = {
  args: {
    variant: "destructive",
    disabled: true,
  },
};
