import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from './Button.component';

const meta = {
    title: 'Atoms/Button',
    component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: { title: 'Continuar', variant: 'primary' },
};

export const Disabled: Story = {
    args: { title: 'disable', variant: 'primary', disabled: true },
};

export const Secondary: Story = {
    args: { title: 'secondary', variant: 'secondary' },
};

export const Outlined: Story = {
    args: { title: 'outlined', variant: 'outlined' },
};

export const Large: Story = {
    args: { title: 'large', size: 'large' },
};

export const Medium: Story = {
    args: { title: 'medium', size: 'medium' },
};

export const Small: Story = {
    args: { title: 'small', size: 'small' },
};