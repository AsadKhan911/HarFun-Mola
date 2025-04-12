import { createSlice } from "@reduxjs/toolkit";

const biddingSlice = createSlice({
  name: "bidding",
  initialState: {
    loading: false,
    user: null,
    jobDetails: null,
    bidOffers: [],
    savedJobs: {}, // <-- NEW: Saved jobs stored as an object with jobId keys
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

    // 🔹 NEW REDUCERS FOR SAVED JOBS
    toggleSaveJob: (state, action) => {
        const job = action.payload; // full job object expected now
        const jobId = job._id;
      
        if (state.savedJobs[jobId]) {
          delete state.savedJobs[jobId];
        } else {
          state.savedJobs[jobId] = job; // store full job object instead of true
        }
      },      

    clearSavedJobs: (state) => {
      state.savedJobs = {};
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
} = biddingSlice.actions;

export default biddingSlice.reducer;
