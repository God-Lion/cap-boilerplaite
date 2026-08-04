import { useSyncExternalStore } from 'react';
import type { TenantThemeConfig } from '../types';

export interface ThemeEditorState {
  isEditing: boolean;
  draftConfig: TenantThemeConfig | null;
}

let state: ThemeEditorState = {
  isEditing: false,
  draftConfig: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const themeEditorStore = {
  getState(): ThemeEditorState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  startEditing(initialConfig: TenantThemeConfig) {
    state = {
      isEditing: true,
      draftConfig: JSON.parse(JSON.stringify(initialConfig)),
    };
    notify();
  },

  setDraftConfig(
    updater: TenantThemeConfig | ((prev: TenantThemeConfig | null) => TenantThemeConfig | null)
  ) {
    const nextConfig = typeof updater === 'function' ? updater(state.draftConfig) : updater;
    state = {
      ...state,
      draftConfig: nextConfig,
    };
    notify();
  },

  discardDraft() {
    state = {
      isEditing: false,
      draftConfig: null,
    };
    notify();
  },
};

export function useThemeEditorStore(): ThemeEditorState;
export function useThemeEditorStore<T>(selector: (state: ThemeEditorState) => T): T;
export function useThemeEditorStore<T>(selector?: (state: ThemeEditorState) => T): T | ThemeEditorState {
  const current = useSyncExternalStore(
    themeEditorStore.subscribe,
    themeEditorStore.getState,
    themeEditorStore.getState
  );

  return selector ? selector(current) : current;
}
