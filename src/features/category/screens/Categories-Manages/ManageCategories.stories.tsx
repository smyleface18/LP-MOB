import type { Meta, StoryObj } from '@storybook/react';
import { ManageCategoriesView } from './ManageCategories.view';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';

const withQuestions = (count: number) => Array.from({ length: count }, () => ({}) as any);

const buildCategory = (overrides: Partial<CategoryQuestion>): CategoryQuestion => ({
  id: 'category-1',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  level: Level.A1,
  descriptionCategory: 'Vocabulario esencial de viajes y transporte en aeropuerto',
  type: TypeQuestionCategory.VOCABULARY,
  questions: withQuestions(24),
  ...overrides,
});

const CATEGORIES: CategoryQuestion[] = [
  buildCategory({ id: '1' }),
  buildCategory({
    id: '2',
    level: Level.B1,
    type: TypeQuestionCategory.GRAMMAR,
    descriptionCategory: 'Gramática intermedia: tiempos verbales pasados y perfectos',
    questions: withQuestions(38),
  }),
  buildCategory({
    id: '3',
    level: Level.B1,
    type: TypeQuestionCategory.LISTENING,
    descriptionCategory: 'Comprensión auditiva: conversaciones cotidianas en la cafetería',
    questions: withQuestions(19),
  }),
  buildCategory({
    id: '4',
    level: Level.C1,
    type: TypeQuestionCategory.READING,
    active: false,
    descriptionCategory: 'Análisis de artículos científicos y debate sobre cambio climático',
    questions: withQuestions(15),
  }),
  buildCategory({
    id: '5',
    level: Level.A2,
    type: TypeQuestionCategory.SPEAKING,
    descriptionCategory: 'Pronunciación básica de fonemas vocálicos y entonación de preguntas',
    questions: withQuestions(42),
  }),
  buildCategory({
    id: '6',
    level: Level.B2,
    type: TypeQuestionCategory.WRITING,
    descriptionCategory: 'Redacción de correos formales y ensayos argumentativos breves',
    questions: withQuestions(31),
  }),
];

const meta: Meta<typeof ManageCategoriesView> = {
  title: 'Screens/ManageCategories',
  component: ManageCategoriesView,
  args: {
    categories: CATEGORIES,
    loading: false,
    error: null,
    searchText: '',
    filtersVisible: true,
    selectedLevels: [],
    selectedTypes: [],
    onSearchChange: () => {},
    onToggleFilters: () => {},
    onToggleLevel: () => {},
    onToggleType: () => {},
    onClearFilters: () => {},
    onCreatePress: () => {},
    onCategoryPress: () => {},
    onDeleteCategory: () => {},
    onToggleActive: () => {},
    onRetry: () => {},
  },
  argTypes: {
    onSearchChange: { action: 'search-change' },
    onToggleFilters: { action: 'toggle-filters' },
    onToggleLevel: { action: 'toggle-level' },
    onToggleType: { action: 'toggle-type' },
    onClearFilters: { action: 'clear-filters' },
    onCreatePress: { action: 'create-press' },
    onCategoryPress: { action: 'category-press' },
    onDeleteCategory: { action: 'delete-category' },
    onToggleActive: { action: 'toggle-active' },
    onRetry: { action: 'retry' },
  },
};

export default meta;

type Story = StoryObj<typeof ManageCategoriesView>;

export const Default: Story = {};

export const FiltersCollapsed: Story = {
  args: { filtersVisible: false },
};

export const WithActiveFilters: Story = {
  args: {
    selectedLevels: [Level.A1, Level.B1],
    selectedTypes: [TypeQuestionCategory.GRAMMAR],
  },
};

export const LoadingState: Story = {
  args: { loading: true, categories: [] },
};

export const ErrorState: Story = {
  args: { error: 'No se pudo conectar con el servidor', categories: [] },
};

export const Empty: Story = {
  args: { categories: [] },
};

export const SearchNoResults: Story = {
  args: { categories: [], searchText: 'xyz' },
};
