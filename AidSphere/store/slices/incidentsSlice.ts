/**
 * incidentsSlice.ts
 * -----------------
 * Stores incident items used by dashboard and map screens. Exposes
 * async thunks for fetching and managing incidents from the backend.
 * 
 * API Calls:
 * - GET /api/v1/incidents - Fetch all incidents
 * - POST /api/v1/incidents - Create new incident
 * - PATCH /api/v1/incidents/{id} - Update incident
 * - DELETE /api/v1/incidents/{id} - Delete incident
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cse-299-disaster-management-draft-r.vercel.app/api/v1';

export interface IncidentItem {
  id: string;
  title?: string;
  description?: string;
  lat: number;
  lon: number;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  status?: 'active' | 'resolved';
  type?: string;
  createdAt?: string;
}

interface IncidentsState {
  items: IncidentItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: IncidentsState = { items: [], status: 'idle', error: null };

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      return await response.json();
    } catch (error: any) {
      // Fallback mock data
      return [
        { id: '1', lat: 23.811, lon: 90.412, priority: 'critical', title: 'Building Collapse' },
        { id: '2', lat: 23.82, lon: 90.405, priority: 'high', title: 'Medical Emergency' },
        { id: '3', lat: 23.804, lon: 90.42, priority: 'medium', title: 'Supply Request' },
        { id: '4', lat: 23.815, lon: 90.428, priority: 'low', title: 'Information Request' },
      ] as IncidentItem[];
    }
  }
);

export const createIncident = createAsyncThunk(
  'incidents/createIncident',
  async (incident: Omit<IncidentItem, 'id'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(incident),
      });

      if (!response.ok) {
        throw new Error('Failed to create incident');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create incident');
    }
  }
);

export const updateIncident = createAsyncThunk(
  'incidents/updateIncident',
  async ({ id, data }: { id: string; data: Partial<IncidentItem> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update incident');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update incident');
    }
  }
);

export const deleteIncident = createAsyncThunk(
  'incidents/deleteIncident',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete incident');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete incident');
    }
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    clearIncidents: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // fetchIncidents cases
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load incidents';
      });

    // createIncident cases
    builder
      .addCase(createIncident.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // updateIncident cases
    builder
      .addCase(updateIncident.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });

    // deleteIncident cases
    builder
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearIncidents } = incidentsSlice.actions;
export default incidentsSlice.reducer;

export const selectAllIncidents = (state: any) => state.incidents.items;
export const selectIncidentsLoading = (state: any) => state.incidents.status === 'loading';
export const selectIncidentsError = (state: any) => state.incidents.error;
