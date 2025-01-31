import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState:{
        loading:false,
        user:null
    },
    //actions
    reducers:{
        setLoading : (state,action) => {
            state.loading = action.payload
        },
        setUser : (state,action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null; // Reset user state
          },
    }
})

export const {setLoading , setUser, logout } = authSlice.actions;
export default authSlice.reducer;
