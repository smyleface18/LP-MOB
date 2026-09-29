import type { Meta, StoryObj } from '@storybook/react';
import NarratedText from './NarratedText.component';

const TEXT = 'Max the little robot woke up alone in an old workshop.';
// Marcas como las de Polly (ms desde el inicio y offsets en caracteres).
const MARKS = ['Max', 'the', 'little', 'robot', 'woke', 'up', 'alone'].reduce<
  { time: number; start: number; end: number; value: string }[]
>((marks, word, index) => {
  const start = TEXT.indexOf(word, marks.at(-1)?.end ?? 0);
  return [...marks, { time: index * 300, start, end: start + word.length, value: word }];
}, []);

const meta: Meta<typeof NarratedText> = {
  title: 'Story/NarratedText',
  component: NarratedText,
  args: {
    text: TEXT,
    speechMarks: MARKS,
    activeIndex: 3,
  },
  argTypes: {
    activeIndex: { control: { type: 'range', min: -1, max: MARKS.length - 1, step: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof NarratedText>;

export const ReadingAWord: Story = {};

export const FirstWord: Story = {
  args: { activeIndex: 0 },
};

export const NotPlaying: Story = {
  args: { activeIndex: -1 },
};

export const WithoutMarks: Story = {
  args: { speechMarks: null },
};
