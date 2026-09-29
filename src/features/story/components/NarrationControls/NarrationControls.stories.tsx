import type { Meta, StoryObj } from '@storybook/react';
import NarrationControls from './NarrationControls.component';

const meta: Meta<typeof NarrationControls> = {
  title: 'Story/NarrationControls',
  component: NarrationControls,
  args: {
    mediaStatus: 'ready',
    hasAudio: true,
    playing: false,
    loading: false,
    progress: 0,
    onToggle: () => {},
  },
  argTypes: {
    onToggle: { action: 'toggle' },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
};

export default meta;

type Story = StoryObj<typeof NarrationControls>;

export const Ready: Story = {};

export const Playing: Story = {
  args: { playing: true, progress: 0.4 },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Preparing: Story = {
  args: { mediaStatus: 'pending', hasAudio: false },
};

export const Failed: Story = {
  args: { mediaStatus: 'failed', hasAudio: false },
};
