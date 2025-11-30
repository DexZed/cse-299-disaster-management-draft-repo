import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string;
  password: string;
  role: 'volunteer' | 'victim' | '';
  rememberMe: boolean;
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    role?: 'volunteer' | 'victim';
  } | null;
}

const initialState: AuthState = {
  email: '',
  password: '',
  role: '',
  rememberMe: false,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setRole: (state, action: PayloadAction<'volunteer' | 'victim' | ''>) => {
      state.role = action.payload;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    signOut: (state) => {
      state.email = '';
      state.password = '';
      state.role = '';
      state.rememberMe = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    resetForm: (state) => {
      state.email = '';
      state.password = '';
      state.role = '';
    },
  },
});

export const {
  setEmail,
  setPassword,
  setRole,
  setRememberMe,
  setUser,
  signOut,
  resetForm,
} = authSlice.actions;

export default authSlice.reducer;
