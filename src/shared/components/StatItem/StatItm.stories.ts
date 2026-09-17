import type { Meta, StoryObj } from '@storybook/react';
import { StatItem } from './Statitem.component';

const meta: Meta<typeof StatItem> = {
  title: 'Atoms/StatItem',
  component: StatItem,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'success'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatItem>;

export const Default: Story = {
  args: {
    value: 85,
    label: 'Puntos',
  },
};

export const Secondary: Story = {
  args: {
    value: 42,
    label: 'Partidas',
    color: 'secondary',
  },
};

export const Gamification: Story = {
  args: {
    value: 1250,
    label: 'XP',
    color: 'accent',
  },
};

export const Success: Story = {
  args: {
    value: 10,
    label: 'Correctas',
    color: 'success',
  },
};

export const StringValue: Story = {
  args: {
    value: 'A1',
    label: 'Nivel',
    color: 'primary',
  },
};
