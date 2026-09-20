import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from './ConfirmDialog.component';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Atoms/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    visible: true,
    title: 'Sign Out',
    message: 'Are you sure you want to sign out?',
    confirmLabel: 'Sign Out',
    cancelLabel: 'Cancel',
    destructive: true,
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Destructive: Story = {};

export const Neutral: Story = {
  args: {
    title: 'Leave Game',
    message: 'You will lose your current progress in this match.',
    confirmLabel: 'Leave',
    destructive: false,
  },
};
