import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    allListings: [], // Stores all businesses for a category
    singleListing: null, // Stores details of a single business if needed
    // isLoading: false, // Manages loading state
    // error: null, // Stores error message if the fetch fails

    //Minor listings
    minorListingsByCategory: [],
  },
  reducers: {
    setAllListings: (state, action) => {
      state.allListings = action.payload;
    },
    setSingleListing: (state, action) => {
      state.singleListing = action.payload;
    },
    // setLoading: (state, action) => {
    //   state.isLoading = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    setAllMinorListingsByCategory: (state, action) => {
      state.minorListingsByCategory = action.payload; // ✅ Update the state properly
    },
  },
});

export const { setAllListings, setSingleListing, setLoading, setError, setAllMinorListingsByCategory } = listingSlice.actions;
export default listingSlice.reducer;
