/**
 * volunteerSlice.ts
 * -----------------
 * Tracks the current volunteer's status and location. Exposes a
 * `fetchVolunteer(id)` thunk which calls the backend to retrieve
 * volunteer data (id, location, status). The slice also exports reducers
 * to update status and location locally (useful for real-time updates).
 * 
 * API Calls:
 * - GET /api/v1/volunteers/{id} - Fetch volunteer data
 * - PATCH /api/v1/volunteers/{id}/status - Update status
 * - PATCH /api/v1/volunteers/{id}/location - Update location
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cse-299-disaster-management-draft-r.vercel.app/api/v1';

interface VolunteerState {
  id?: string;
  name?: string;
  email?: string;
  status: 'available' | 'busy' | 'offline';
  latitude?: number;
  longitude?: number;
  loading: boolean;
  error?: string | null;
}

const initialState: VolunteerState = {
  status: 'available',
  loading: false,
  error: null,
};

export const fetchVolunteer = createAsyncThunk(
  'volunteer/fetchVolunteer',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch volunteer');
      }

      return await response.json();
    } catch (error: any) {
      // Fallback simulated volunteer for demo
      return {
        id,
        status: 'available',
        latitude: 23.826,
        longitude: 90.422,
      };
    }
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  'volunteer/updateVolunteerStatus',
  async (
    { id, status }: { id: string; status: 'available' | 'busy' | 'offline' },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/volunteers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      return status;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

export const updateVolunteerLocation = createAsyncThunk(
  'volunteer/updateVolunteerLocation',
  async (
    { id, latitude, longitude }: { id: string; latitude: number; longitude: number },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/volunteers/${id}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return { latitude, longitude };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update location');
    }
  }
);

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setLocation(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setVolunteerInfo(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    // fetchVolunteer cases
    builder
      .addCase(fetchVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.status = action.payload.status;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.error = null;
      })
      .addCase(fetchVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch volunteer';
      });

    // updateVolunteerStatus cases
    builder
      .addCase(updateVolunteerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.error = null;
      })
      .addCase(updateVolunteerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateVolunteerLocation cases
    builder
      .addCase(updateVolunteerLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVolunteerLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.error = null;
      })
      .addCase(updateVolunteerLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStatus, setLocation, setVolunteerInfo } = volunteerSlice.actions;
export default volunteerSlice.reducer;

export const selectVolunteer = (state: any) => state.volunteer;
export const selectVolunteerStatus = (state: any) => state.volunteer.status;
export const selectVolunteerLocation = (state: any) => ({
  latitude: state.volunteer.latitude,
  longitude: state.volunteer.longitude,
});
export const selectVolunteerLoading = (state: any) => state.volunteer.loading;
