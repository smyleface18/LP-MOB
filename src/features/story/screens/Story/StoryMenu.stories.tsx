import type { Meta, StoryObj } from '@storybook/react';
import StoryMenuView from './StoryMenu.view';

const meta: Meta<typeof StoryMenuView> = {
  title: 'Screens/StoryMenu',
  component: StoryMenuView,
  args: {
    creating: false,
    joining: false,
    onCreate: () => {},
    onJoin: () => {},
  },
  argTypes: {
    onCreate: { action: 'create' },
    onJoin: { action: 'join' },
  },
};

export default meta;

type Story = StoryObj<typeof StoryMenuView>;

export const Default: Story = {};

export const Creating: Story = {
  args: {
    creating: true,
  },
};

export const Joining: Story = {
  args: {
    joining: true,
  },
};
