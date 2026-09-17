import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar.component';

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  args: {
    percentage: 65,
    label: 'Progreso de la lección',
    color: 'primary',
  },
  argTypes: {
    percentage: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'accent'],
      description: 'Color semántico del progreso. Accent se reserva para métricas de gamificación.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    percentage: 65,
    label: 'Progreso de la lección',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    percentage: 45,
    label: 'Progreso secundario',
    color: 'secondary',
  },
};

export const Success: Story = {
  args: {
    percentage: 100,
    label: 'Lección completada',
    color: 'success',
  },
};

export const Gamification: Story = {
  args: {
    percentage: 80,
    label: 'Progreso de XP',
    color: 'accent',
  },
};

export const Empty: Story = {
  args: {
    percentage: 0,
    label: 'Sin progreso',
    color: 'primary',
  },
};
