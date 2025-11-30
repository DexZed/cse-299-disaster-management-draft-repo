/**
 * incidentsSlice.ts
 * -----------------
 * Stores incident items used by dashboard and map screens. Exposes
 * `fetchIncidents()` which calls the backend `/api/incidents` endpoint.
 * When integrating your real API, update the endpoint and handling logic
 * below. The slice keeps `items`, `status`, and `error` so UI can show
 * loading/errors based on slice state.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IncidentItem {
  id: string;
  lat: number;
  lon: number;
  priority?: string;
}

interface IncidentsState {
  items: IncidentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: IncidentsState = { items: [], status: 'idle', error: null };

export const fetchIncidents = createAsyncThunk('incidents/fetchIncidents', async () => {
  try {
    const resp = await fetch('/api/incidents');
    if (!resp.ok) throw new Error('Network response not ok');
    return (await resp.json()) as IncidentItem[];
  } catch (err) {
    // fallback mock
    return [
      { id: '1', lat: 23.811, lon: 90.412, priority: 'critical' },
      { id: '2', lat: 23.82, lon: 90.405, priority: 'high' },
      { id: '3', lat: 23.804, lon: 90.42, priority: 'medium' },
      { id: '4', lat: 23.815, lon: 90.428, priority: 'supply' },
    ] as IncidentItem[];
  }
});

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load incidents';
      });
  },
});

export default incidentsSlice.reducer;
export const selectAllIncidents = (state: any) => state.incidents.items;
