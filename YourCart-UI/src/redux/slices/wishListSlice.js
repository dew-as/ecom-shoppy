// src/redux/slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

// Thunks for async wishlist actions with authentication check
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { getState, rejectWithValue }) => {
        const { isAuthenticated } = getState().auth;
        if (!isAuthenticated) return rejectWithValue("User not authenticated");

        try {
            const response = await axiosConfig.get('wishlist');
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return rejectWithValue("Wishlist not found");
            }
            return rejectWithValue(error.response ? error.response.data : "Network error");
        }
    }
);


export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().auth;
    if (!isAuthenticated) return rejectWithValue("User not authenticated");

    try {
        const response = await axiosConfig.post('wishlist/add', { productId });
        return response.data.wishlist; // Adjusted to return only wishlist data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().auth;
    if (!isAuthenticated) return rejectWithValue("User not authenticated");

    try {
        const response = await axiosConfig.delete(`wishlist/remove/${productId}`);
        return response.data.wishlist; // Adjusted to return only wishlist data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products; // Assuming `products` array
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products; // Use products directly
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload.products; // Update items after removal
            });
    },
});

export default wishlistSlice.reducer;
