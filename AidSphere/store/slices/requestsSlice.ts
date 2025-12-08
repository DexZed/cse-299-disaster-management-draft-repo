/**
 * requestsSlice.ts
 * ----------------
 * Manages request items (incoming help requests) and exposes async thunks
 * to fetch requests and to accept/decline them. Each thunk uses `fetch`
 * to call a backend endpoint with proper error handling and auth headers.
 *
 * API Calls:
 * - GET /api/v1/requests - Fetch all requests
 * - PATCH /api/v1/requests/{id}/accept - Accept request
 * - PATCH /api/v1/requests/{id}/decline - Decline request
 * - PATCH /api/v1/requests/{id}/complete - Mark request complete
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cse-299-disaster-management-draft-r.vercel.app/api/v1';

export interface RequestItem {
  id: string;
  type: string;
  location: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'pending' | 'accepted' | 'declined' | 'completed';
  description?: string;
  createdAt?: string;
}

interface RequestsState {
  items: RequestItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: RequestsState = {
  items: [
    { id: '1', type: 'Food Request', location: 'Mirpur-10, Dhaka', priority: 'high', status: 'pending' },
    { id: '2', type: 'Medical Request', location: 'Dhanmondi, Dhaka', priority: 'critical', status: 'pending' },
  ],
  status: 'idle',
  error: null,
};

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      return await response.json();
    } catch (error: any) {
      // Fallback mock data
      return [
        { id: '1', type: 'Food Request', location: 'Mirpur-10, Dhaka', priority: 'high', status: 'pending' },
        { id: '2', type: 'Medical Request', location: 'Dhanmondi, Dhaka', priority: 'critical', status: 'pending' },
      ] as RequestItem[];
    }
  }
);

export const acceptRequest = createAsyncThunk(
  'requests/acceptRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/requests/${id}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to accept request');
    }
  }
);

export const declineRequest = createAsyncThunk(
  'requests/declineRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/requests/${id}/decline`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to decline request');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to decline request');
    }
  }
);

export const completeRequest = createAsyncThunk(
  'requests/completeRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/requests/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete request');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete request');
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearRequests: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // fetchRequests cases
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Merge new data with existing state to preserve status
        const fetchedItems = action.payload;
        const mergedItems = fetchedItems.map((fetched: RequestItem) => {
          const existing = state.items.find((item) => item.id === fetched.id);
          return existing ? { ...fetched, status: existing.status } : fetched;
        });
        state.items = mergedItems;
        state.error = null;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load requests';
      });

    // acceptRequest cases
    builder
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const item = state.items.find((r) => r.id === action.payload);
        if (item) item.status = 'accepted';
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // declineRequest cases
    builder
      .addCase(declineRequest.fulfilled, (state, action) => {
        const item = state.items.find((r) => r.id === action.payload);
        if (item) item.status = 'declined';
      })
      .addCase(declineRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // completeRequest cases
    builder
      .addCase(completeRequest.fulfilled, (state, action) => {
        const item = state.items.find((r) => r.id === action.payload);
        if (item) item.status = 'completed';
      })
      .addCase(completeRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearRequests } = requestsSlice.actions;
export default requestsSlice.reducer;

export const selectAllRequests = (state: any) => state.requests.items;
export const selectRequestsLoading = (state: any) => state.requests.status === 'loading';
export const selectRequestsError = (state: any) => state.requests.error;
export const selectRequestById = (state: any, id: string) =>
  state.requests.items.find((item: RequestItem) => item.id === id);
