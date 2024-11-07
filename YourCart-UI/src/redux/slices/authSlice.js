// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

// Create an async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosConfig.get('users/profile');
            console.log(response);
            return response.data; // Return the fetched user data
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle error
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        isAdmin: false,
        user: {},
        loading: false,
        error: null,
    },
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('_id', action.payload._id);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.user = {}; // Clear user data on logout
            localStorage.removeItem('isAuth');
            localStorage.removeItem('_id');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true; // Set loading state
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false; // Reset loading state
                const { name, email, phone, address, isAdmin } = action.payload;

                // Update user and address state
                state.user = {
                    name,
                    email,
                    phone,
                    address: address || {
                        street: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                    },
                };

                // Set isAdmin based on the fetched profile data
                state.isAdmin = isAdmin || false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false; // Reset loading state
                state.error = action.payload; // Set error state
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
