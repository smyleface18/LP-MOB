import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar.component';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  args: {
    percentage: 65,
    label: 'Progreso de la lección',
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
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    percentage: 65,
    label: 'Progreso de la lección',
  },
};

export const SecondaryToAccent: Story = {
  args: {
    percentage: 45,
    label: 'Progreso secundario',
    colors: GRADIENT_PRESETS.secondaryToAccent,
  },
};

export const SuccessToPrimary: Story = {
  args: {
    percentage: 100,
    label: 'Lección completada',
    colors: GRADIENT_PRESETS.successToPrimary,
  },
};

export const TricolorEnergy: Story = {
  args: {
    percentage: 100,
    label: 'Progreso de XP',
    colors: GRADIENT_PRESETS.tricolorEnergy,
  },
};

export const CustomColors: Story = {
  args: {
    percentage: 80,
    label: 'Combinación custom',
    colors: ['accentSubtle', 'accent', 'primary'],
  },
};

export const Empty: Story = {
  args: {
    percentage: 0,
    label: 'Sin progreso',
  },
};
