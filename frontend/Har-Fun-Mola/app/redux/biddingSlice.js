import { createSlice } from "@reduxjs/toolkit";

const biddingSlice = createSlice({
  name: "bidding",
  initialState: {
    loading: false,
    user: null,
    jobDetails: null,
    bidOffers: [],
    savedJobs: {}, // Saved jobs stored by jobId
    elapsedJobs: {}, // 🔹 NEW: Track elapsed time per job
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },
    addBidOffer: (state, action) => {
      state.bidOffers = action.payload;
    },
    clearJobDetails: (state) => {
      state.jobDetails = null;
    },
    clearBidOffers: (state) => {
      state.bidOffers = [];
    },

    // 🔹 Saved Jobs
    toggleSaveJob: (state, action) => {
      const job = action.payload;
      const jobId = job._id;

      if (state.savedJobs[jobId]) {
        delete state.savedJobs[jobId];
      } else {
        state.savedJobs[jobId] = job;
      }
    },
    clearSavedJobs: (state) => {
      state.savedJobs = {};
    },

    // 🔹 Elapsed Job Tracking
    setJobStartTime: (state, action) => {
      const { jobId, startTime } = action.payload;
      state.elapsedJobs[jobId] = {
        ...state.elapsedJobs[jobId],
        startTime,
        isCompleted: false,
      };
    },
    completeJob: (state, action) => {
      const { jobId, completedTime } = action.payload;
      if (state.elapsedJobs[jobId]) {
        state.elapsedJobs[jobId].completedTime = completedTime;
        state.elapsedJobs[jobId].isCompleted = true;
      }
    },
    clearElapsedJobs: (state) => {
      state.elapsedJobs = {};
    },
  },
});

export const {
  setLoading,
  setJobDetails,
  addBidOffer,
  clearJobDetails,
  clearBidOffers,
  toggleSaveJob,
  clearSavedJobs,
  setJobStartTime,
  completeJob,
  clearElapsedJobs,
} = biddingSlice.actions;

export default biddingSlice.reducer;
