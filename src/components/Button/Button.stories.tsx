import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type ButtonStory = StoryObj<typeof Button>;

export const DefaultButton: ButtonStory = {
  render: () => <Button>Default</Button>,
};

export const DisabledButton: ButtonStory = {
  render: () => <Button disabled>Disabled</Button>,
};
