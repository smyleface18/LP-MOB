import type { Meta, StoryObj } from '@storybook/react';
import Logo from './Logo.component';

const meta: Meta<typeof Logo> = {
  title: 'Atoms/Logo',
  component: Logo,
  args: {
    imageSize: 96,
    layout: 'vertical',
    showText: true,
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Posición del texto respecto al ícono.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    imageSize: 56,
    layout: 'horizontal',
  },
};

export const IconOnly: Story = {
  args: {
    imageSize: 96,
    showText: false,
  },
};

export const Small: Story = {
  args: {
    imageSize: 40,
    layout: 'horizontal',
    textSize: 16,
  },
};
