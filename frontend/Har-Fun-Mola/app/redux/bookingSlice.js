import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "bookings",
  initialState: {
    allBookings: [], // Stores all businesses for a category
    allProviderBookings: [],
    singleBooking: [],

    // isServiceStarted: false, //for active details booking start service button state purpose.
    // showConfirmationModal: false
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
    },
    // setIsServiceStarted: (state, action) => {
    //   state.isServiceStarted = action.payload;
    // },
    // setShowConfirmationModal: (state, action) => {
    //   state.showConfirmationModal = action.payload;
    // }
  }
});

export const { setAllBookings , setAllProviderBookings, 
  setSingleBooking  } = listingSlice.actions;
export default listingSlice.reducer;
