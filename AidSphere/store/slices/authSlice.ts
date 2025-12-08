import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cse-299-disaster-management-draft-r.vercel.app/api/v1';

interface AuthState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'volunteer' | 'victim' | '';
  rememberMe: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'volunteer' | 'victim';
    token?: string;
  } | null;
}

const initialState: AuthState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: '',
  rememberMe: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password, role }: { email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return {
        id: data.user?.id,
        email: data.user?.email,
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        role: data.user?.role,
        token: data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    {
      firstName,
      lastName,
      email,
      password,
      role,
    }: { firstName: string; lastName: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      return {
        id: data.user?.id,
        email: data.user?.email,
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        role: data.user?.role,
        token: data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

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
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
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
      state.firstName = '';
      state.lastName = '';
      state.role = '';
      state.rememberMe = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    resetForm: (state) => {
      state.email = '';
      state.password = '';
      state.firstName = '';
      state.lastName = '';
      state.role = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login thunk handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Signup thunk handlers
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const {
  setEmail,
  setPassword,
  setFirstName,
  setLastName,
  setRole,
  setRememberMe,
  setUser,
  signOut,
  resetForm,
} = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state: any) => state.auth;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectUser = (state: any) => state.auth.user;
export const selectAuthLoading = (state: any) => state.auth.loading;
export const selectAuthError = (state: any) => state.auth.error;
