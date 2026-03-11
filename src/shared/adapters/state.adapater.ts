import { create, StateCreator } from 'zustand';

export function createState<T>(initializer: StateCreator<T>) {
  return create<T>()(initializer);
}
