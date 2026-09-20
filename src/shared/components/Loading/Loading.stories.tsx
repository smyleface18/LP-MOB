import type { Meta, StoryObj } from '@storybook/react';
import Loading from './Loading.component';

const meta: Meta<typeof Loading> = {
  title: 'Atoms/Loading',
  component: Loading,
  args: {
    size: 64,
    loop: true,
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 160,
  },
};

export const Small: Story = {
  args: {
    size: 32,
  },
};
