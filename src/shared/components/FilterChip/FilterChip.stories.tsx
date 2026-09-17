import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { FilterChip } from './FilterChip.component';


const meta = {
    title: 'Atoms/FilterChip',
    component: FilterChip,
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
    args: {
        label: 'Vocabulario',
        isActive: false,
        onPress: () => { },
    },
};

export const Active: Story = {
    args: {
        label: 'Vocabulario',
        isActive: true,
        onPress: () => { },
    },
};

export const LongLabel: Story = {
    args: {
        label: 'Comprensión auditiva avanzada',
        isActive: false,
        onPress: () => { },
    },
};


export const Interactive: Story = {
    args: {
        label: 'Toca para alternar',
        isActive: false,
        onPress: () => { },
    },
    render: () => {
        const [active, setActive] = useState(false);
        return (
            <FilterChip label="Toca para alternar" isActive={active} onPress={() => setActive((v) => !v)} />
        );
    },
};
