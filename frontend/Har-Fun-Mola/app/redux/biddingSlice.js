import { createSlice } from "@reduxjs/toolkit";

const biddingSlice = createSlice({
    name: "bidding",
    initialState: {
        loading: false,
        user: null,
        jobDetails: null, // Store job details
        bidOffers: [],    // New state to store multiple bid offers
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setJobDetails: (state, action) => {
            state.jobDetails = action.payload; // Store job details
        },
        addBidOffer: (state, action) => {
            state.bidOffers = action.payload; // Pushes offer to bidOffers array
          },
        clearJobDetails: (state) => {
            state.jobDetails = null; // Clear job details
        },
        clearBidOffers: (state) => {
            state.bidOffers = []; // Clear all bid offers
        },
    },
});

export const { setLoading, setJobDetails, addBidOffer, clearJobDetails, clearBidOffers } = biddingSlice.actions;
export default biddingSlice.reducer;
