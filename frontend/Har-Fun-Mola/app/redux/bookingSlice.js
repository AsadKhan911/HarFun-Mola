import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "bookings",
  initialState: {
    allBookings: [], // Stores all businesses for a category
  },
  
  reducers: {
    setAllBookings: (state, action) => {
      state.allBookings = action.payload;
    }
  }
});

export const { setAllBookings } = listingSlice.actions;
export default listingSlice.reducer;
