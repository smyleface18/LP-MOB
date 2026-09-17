import type { Meta, StoryObj } from '@storybook/react-native';
import InputComponent from './Input.component';

const meta = {
  title: 'Atoms/Input',
  component: InputComponent,
  args: {
    placeholder: 'Escribe aquí...',
  },
} satisfies Meta<typeof InputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const WithError: Story = {
  args: {
    variant: 'outlined',
    error: true,
    value: 'texto inválido',
  },
};

export const WithValue: Story = {
  args: {
    variant: 'default',
    value: 'Texto ya escrito',
  },
};
