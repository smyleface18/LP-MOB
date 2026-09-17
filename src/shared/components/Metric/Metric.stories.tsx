import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './Metric.component';

const meta: Meta<typeof MetricCard> = {
  title: 'Atoms/MetricCard',
  component: MetricCard,
  args: {
    value: 42,
    label: 'Preguntas',
    subLabel: 'Completadas',
    color: 'primary',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'success'],
      description: 'Color semántico del valor de la métrica.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    value: 42,
    label: 'Preguntas',
    subLabel: 'Completadas',
  },
};

export const Secondary: Story = {
  args: {
    value: 18,
    label: 'Partidas',
    subLabel: 'Jugadas',
    color: 'secondary',
  },
};

export const XP: Story = {
  args: {
    value: 1250,
    label: 'XP',
    subLabel: 'Experiencia',
    color: 'accent',
  },
};

export const Success: Story = {
  args: {
    value: 95,
    label: 'Respuestas',
    subLabel: 'Correctas',
    color: 'success',
  },
};

export const WithoutSubLabel: Story = {
  args: {
    value: 7,
    label: 'Racha',
    color: 'accent',
  },
};
