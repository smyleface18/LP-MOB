import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderComponent from './Header.component';

const meta = {
  title: 'Molecules/Header',
  component: HeaderComponent,
} satisfies Meta<typeof HeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Placeholders simples para leading/trailing en los stories.
// En la app real, aquí van tus componentes de Icon/Avatar reales.
const BackButton = () => (
  <TouchableOpacity hitSlop={8}>
    <Text style={{ fontSize: 24 }}>←</Text>
  </TouchableOpacity>
);

const Avatar = () => (
  <View
    style={{
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#EA580C',
    }}
  />
);

export const Default: Story = {
  args: {
    title: 'Categorías',
    subtitle: 'Vocabulario',
  },
};

export const BrandVariant: Story = {
  args: {
    title: 'LinguaPlay',
    subtitle: 'Aprende jugando',
    variant: 'brand',
  },
};

export const WithLeading: Story = {
  args: {
    title: 'Lección 3',
    subtitle: 'Verbos irregulares',
    leading: <BackButton />,
  },
};

export const WithTrailing: Story = {
  args: {
    title: 'Mi perfil',
    trailing: <Avatar />,
  },
};

export const WithLeadingAndTrailing: Story = {
  args: {
    title: 'Configuración',
    leading: <BackButton />,
    trailing: <Avatar />,
    variant: 'brand',
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Solo título',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Este es un título bastante largo para probar el wrap',
    subtitle: 'Y este subtítulo también es un poco más extenso de lo normal',
  },
};
