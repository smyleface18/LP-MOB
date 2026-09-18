import type { Meta, StoryObj } from '@storybook/react';
import { VideoViewComponent } from './VideoView.component';

const meta: Meta<typeof VideoViewComponent> = {
  title: 'Question/ContentTypes/VideoView',
  component: VideoViewComponent,
  args: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
};

export default meta;

type Story = StoryObj<typeof VideoViewComponent>;

export const Default: Story = {};
