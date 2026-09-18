import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './CircularProgress.component';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';

const meta = {
  title: 'Atoms/CircularProgress',
  component: CircularProgress,
  args: {
    percentage: 50,
    label: 'Vocabulario',
  },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondaryToAccent: Story = {
  args: {
    percentage: 65,
    colors: GRADIENT_PRESETS.secondaryToAccent,
  },
};

export const SuccessToPrimary: Story = {
  args: {
    percentage: 88,
    colors: GRADIENT_PRESETS.successToPrimary,
  },
};

export const TricolorProgress: Story = {
  args: {
    percentage: 92,
    colors: GRADIENT_PRESETS.tricolorProgress,
  },
};

export const CustomColors: Story = {
  args: {
    percentage: 40,
    colors: ['accentSubtle', 'accent', 'primary'],
  },
};
