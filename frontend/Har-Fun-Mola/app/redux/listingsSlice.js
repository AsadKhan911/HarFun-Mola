import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    allListings: [], // Stores all businesses for a category
    singleListing: null, // Stores details of a single business if needed
    isLoading: false, // Manages loading state
    error: null, // Stores error message if the fetch fails
  },
  reducers: {
    setAllListings: (state, action) => {
      state.allListings = action.payload;
    },
    setSingleListing: (state, action) => {
      state.singleListing = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAllListings, setSingleListing, setLoading, setError } = listingSlice.actions;
export default listingSlice.reducer;
