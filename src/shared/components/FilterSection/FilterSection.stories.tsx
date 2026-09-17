import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { FilterSection } from './FilterSection.component';

const meta = {
    title: 'Molecules/FilterSection',
    component: FilterSection,
} satisfies Meta<typeof FilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const CATEGORY_OPTIONS = [
    { value: 'vocab', label: 'Vocabulario' },
    { value: 'grammar', label: 'Gramática' },
    { value: 'listening', label: 'Comprensión auditiva' },
    { value: 'speaking', label: 'Pronunciación' },
];


export const Default: Story = {
    args: {
        title: 'Categorías',
        options: CATEGORY_OPTIONS,
        selectedValue: 'all',
        onValueChange: () => { },
    },
    render: () => {
        const [selected, setSelected] = useState('all');
        return (
            <FilterSection
                title="Categorías"
                options={CATEGORY_OPTIONS}
                selectedValue={selected}
                onValueChange={setSelected}
            />
        );
    },
};

export const WithSelection: Story = {
    args: {
        title: 'Categorías',
        options: CATEGORY_OPTIONS,
        selectedValue: 'grammar',
        onValueChange: () => { },
    },
    render: () => {
        const [selected, setSelected] = useState('grammar');
        return (
            <FilterSection
                title="Categorías"
                options={CATEGORY_OPTIONS}
                selectedValue={selected}
                onValueChange={setSelected}
            />
        );
    },
};

export const FewOptions: Story = {
    args: {
        title: 'Nivel',
        options: [
            { value: 'beginner', label: 'Principiante' },
            { value: 'advanced', label: 'Avanzado' },
        ],
        selectedValue: 'all',
        onValueChange: () => { },
    },
    render: () => {
        const [selected, setSelected] = useState('all');
        return (
            <FilterSection
                title="Nivel"
                options={[
                    { value: 'beginner', label: 'Principiante' },
                    { value: 'advanced', label: 'Avanzado' },
                ]}
                selectedValue={selected}
                onValueChange={setSelected}
            />
        );
    },
};

export const ManyOptions: Story = {
    args: {
        title: 'Categorías',
        options: CATEGORY_OPTIONS,
        selectedValue: 'all',
        onValueChange: () => { },
    },
    render: () => {
        const [selected, setSelected] = useState('all');
        return (
            <FilterSection
                title="Categorías"
                options={[
                    ...CATEGORY_OPTIONS,
                    { value: 'reading', label: 'Lectura' },
                    { value: 'writing', label: 'Escritura' },
                    { value: 'idioms', label: 'Modismos y expresiones' },
                ]}
                selectedValue={selected}
                onValueChange={setSelected}
            />
        );
    },
};

export const WithoutAllOption: Story = {
    args: {
        title: 'Categorías',
        options: CATEGORY_OPTIONS,
        selectedValue: 'vocab',
        onValueChange: () => { },
        showAllOption: false,
    },
    render: () => {
        const [selected, setSelected] = useState('vocab');
        return (
            <FilterSection
                title="Categorías"
                options={CATEGORY_OPTIONS}
                selectedValue={selected}
                onValueChange={setSelected}
                showAllOption={false}
            />
        );
    },
};