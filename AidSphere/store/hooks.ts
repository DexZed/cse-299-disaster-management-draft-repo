/**
 * hooks.ts
 * ------
 * Typed hooks for use throughout the app. Import `useAppDispatch` and
 * `useAppSelector` in components to get correctly typed dispatch and
 * selector behaviour based on the store's `RootState` and `AppDispatch`.
 */
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use these hooks instead of plain `useDispatch`/`useSelector` to get
// helpful TypeScript types for state and dispatch in your components.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
