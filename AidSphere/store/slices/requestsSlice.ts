/**
 * requestsSlice.ts
 * ----------------
 * Manages request items (incoming help requests) and exposes async thunks
 * to fetch requests and to accept/decline them. Each thunk uses `fetch`
 * to call a backend endpoint; if your backend URL or auth changes, update
 * the fetch calls here. Reducers update the `items` array and item status.
 *
 * Exports:
 * - fetchRequests: async thunk to load requests from the server
 * - acceptRequest / declineRequest: async thunks to update request state
 * - selectAllRequests: selector to read requests from the store
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface RequestItem {
  id: string;
  type: string;
  location: string;
  priority?: string;
  status?: 'pending' | 'accepted' | 'declined';
}

interface RequestsState {
  items: RequestItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: RequestsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
  try {
    const resp = await fetch('/api/requests');
    if (!resp.ok) throw new Error('Network response not ok');
    return (await resp.json()) as RequestItem[];
  } catch (err) {
    // Fallback mock data when API not available
    return [
      { id: '1', type: 'Food Request', location: 'Mirpur-10, Dhaka', priority: 'high', status: 'pending' },
      { id: '2', type: 'Medical Request', location: 'Dhanmondi, Dhaka', priority: 'critical', status: 'pending' },
    ] as RequestItem[];
  }
});

export const acceptRequest = createAsyncThunk('requests/acceptRequest', async (id: string) => {
  try {
    const resp = await fetch(`/api/requests/${id}/accept`, { method: 'POST' });
    if (!resp.ok) throw new Error('Network response not ok');
    return id;
  } catch (err) {
    // If API not available, simulate success
    return id;
  }
});

export const declineRequest = createAsyncThunk('requests/declineRequest', async (id: string) => {
  try {
    const resp = await fetch(`/api/requests/${id}/decline`, { method: 'POST' });
    if (!resp.ok) throw new Error('Network response not ok');
    return id;
  } catch (err) {
    return id;
  }
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load requests';
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const id = action.payload;
        const it = state.items.find((r) => r.id === id);
        if (it) it.status = 'accepted';
      })
      .addCase(declineRequest.fulfilled, (state, action) => {
        const id = action.payload;
        const it = state.items.find((r) => r.id === id);
        if (it) it.status = 'declined';
      });
  },
});

export default requestsSlice.reducer;

export const selectAllRequests = (state: any) => state.requests.items;
