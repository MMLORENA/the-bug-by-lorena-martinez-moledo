import type { Meta, StoryObj } from "@storybook/react";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
  component: Loading,
};

export default meta;

type LoadingStory = StoryObj<typeof Loading>;

export const DefaultLoading: LoadingStory = {
  render: () => <Loading />,
};
