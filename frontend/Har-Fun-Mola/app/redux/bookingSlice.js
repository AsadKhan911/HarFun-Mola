import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "bookings",
  initialState: {
    allBookings: [], // Stores all businesses for a category
    allProviderBookings: [],
    singleBooking: [],
  },
  
  reducers: {
    setAllBookings: (state, action) => {
      state.allBookings = action.payload;
    },
    setAllProviderBookings: (state, action) => {
      state.allProviderBookings = action.payload;
    },
    setSingleBooking: (state, action) => {
      state.singleBooking = action.payload;
    }
  }
});

export const { setAllBookings , setAllProviderBookings, setSingleBooking } = listingSlice.actions;
export default listingSlice.reducer;
