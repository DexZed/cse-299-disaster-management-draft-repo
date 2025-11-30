/**
 * volunteerSlice.ts
 * -----------------
 * Tracks the current volunteer's status and location. Exposes a
 * `fetchVolunteer(id)` thunk which should call your backend to retrieve
 * volunteer data (id, location, status). The slice also exports reducers
 * to update status and location locally (useful for real-time updates).
 *
 * To connect a real backend, adjust the fetch URL and include auth headers
 * if required. This slice is used by tracking screens to read the current
 * volunteer position via `selectVolunteer`.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface VolunteerState {
  id?: string;
  status: 'available' | 'busy' | 'offline';
  latitude?: number;
  longitude?: number;
  loading: boolean;
  error?: string | null;
}

const initialState: VolunteerState = { status: 'available', loading: false, error: null };

export const fetchVolunteer = createAsyncThunk('volunteer/fetchVolunteer', async (id: string) => {
  try {
    const resp = await fetch(`/api/volunteer/${id}`);
    if (!resp.ok) throw new Error('Network response not ok');
    return (await resp.json()) as VolunteerState;
  } catch (err) {
    // fallback simulated volunteer
    return { id: 'demo-vol', status: 'available', latitude: 23.826, longitude: 90.422, loading: false } as VolunteerState;
  }
});

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.status = action.payload.status;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
      })
      .addCase(fetchVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch volunteer';
      });
  },
});

export const { setStatus, setLocation } = volunteerSlice.actions;
export default volunteerSlice.reducer;

export const selectVolunteer = (state: any) => state.volunteer;
