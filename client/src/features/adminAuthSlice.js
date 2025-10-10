import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    isAuthenticated: false,
}

// create slice
const adminAuthSlice = createSlice({
    initialState,
    name: 'adminAuth',
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload.admin;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        logout: (state) => {
            state.admin = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAdmin, setIsAuthenticated, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;