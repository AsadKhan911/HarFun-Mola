import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"
import listingReducer from './listingsSlice.js'
const store = configureStore({
    reducer : {
        auth : authReducer,
        listing: listingReducer
    }
})

export default store;