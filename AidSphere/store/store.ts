/**
 * store.ts
 * -------
 * Central Redux store configuration. Reducers from feature slices are
 * registered here. `RootState` and `AppDispatch` types are exported for
 * use with the typed hooks in `store/hooks.ts`.
 *
 * When you add new slices, import them and add them to the reducer map.
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import requestsReducer from './slices/requestsSlice';
import incidentsReducer from './slices/incidentsSlice';
import volunteerReducer from './slices/volunteerSlice';
import reportReducer from './slices/reportSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    requests: requestsReducer,
    incidents: incidentsReducer,
    volunteer: volunteerReducer,
    report: reportReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
