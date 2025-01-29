import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import listingReducer from "./listingsSlice.js";
import bookingReducer from "./bookingSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
    key: "root",
    version: 1,
    storage: AsyncStorage, // Ensure you're using the correct AsyncStorage
};

const rootReducer = combineReducers({
    auth: authReducer,
    listing: listingReducer,
    bookings: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, // Wrap persistedReducer in the reducer key
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required to avoid warnings with redux-persist
        }),
});

export const persistor = persistStore(store);
