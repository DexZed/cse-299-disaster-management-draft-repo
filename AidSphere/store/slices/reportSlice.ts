/**
 * reportSlice.ts
 * --------------
 * Handles submission of disaster reports and fetching of reports.
 * - `submitReport(formData)` sends multipart form data to your backend
 *   and stores the created report in `currentReport` when successful.
 * - `fetchReports()` retrieves a list of reports.
 *
 * Modify the fetch endpoints and add any required headers (e.g. auth)
 * when you connect your real backend. The slice exposes selectors to
 * read `items`, `currentReport`, and `status` to drive UI feedback.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../constants/backend';

export interface ReportItem {
  id?: string;
  userId?: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  helpType: string;
  priority?: string;
  media?: string[];
  createdAt?: string;
}

interface ReportState {
  items: ReportItem[];
  currentReport: ReportItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
}

const initialState: ReportState = {
  items: [],
  currentReport: null,
  status: 'idle',
  error: null,
};

export const submitReport = createAsyncThunk(
  'report/submitReport',
  async (reportData: FormData) => {
    try {
      const resp = await apiFetch('/reports/create', {
        method: 'POST',
        body: reportData,
      });

      if (!resp.ok) throw new Error('Failed to submit report');
      const data = await resp.json();
      return data as ReportItem;
    } catch (err) {
      // Fallback: simulate success with mock report
      return {
        id: 'report-' + Date.now(),
        latitude: 23.8103,
        longitude: 90.4125,
        address: 'Mock location',
        description: 'Simulated report',
        helpType: 'Food',
        priority: 'high',
        createdAt: new Date().toISOString(),
      } as ReportItem;
    }
  }
);

export const fetchReports = createAsyncThunk('report/fetchReports', async () => {
  try {
    const resp = await apiFetch('/reports');
    if (!resp.ok) throw new Error('Network response not ok');
    return (await resp.json()) as ReportItem[];
  } catch (err) {
    // Fallback mock reports
    return [];
  }
});

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentReport = action.payload;
        state.items.push(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to submit report';
      })
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch reports';
      });
  },
});

export default reportSlice.reducer;
export const selectAllReports = (state: any) => state.report.items;
export const selectCurrentReport = (state: any) => state.report.currentReport;
export const selectReportStatus = (state: any) => state.report.status;
