import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  successMessage: string | null;
  selectedNeed: string; // Added selectedNeed property
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  showPassword: false,
  successMessage: null,
  selectedNeed: 'Food', // Default value for selectedNeed
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    togglePasswordVisibility: (state) => {
      state.showPassword = !state.showPassword;
    },
    setShowPassword: (state, action: PayloadAction<boolean>) => {
      state.showPassword = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setNeed: (state, action: PayloadAction<string>) => {
      state.selectedNeed = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  togglePasswordVisibility,
  setShowPassword,
  setSuccessMessage,
  clearMessages,
  setNeed, // Exported setNeed action
} = uiSlice.actions;

export default uiSlice.reducer;
