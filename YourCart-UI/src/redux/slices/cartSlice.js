// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

// Thunks for async cart actions with authentication check
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().auth;
    if (!isAuthenticated) return rejectWithValue("User not authenticated");

    try {
        const response = await axiosConfig.get('cart');
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data);
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().auth;
    if (!isAuthenticated) return rejectWithValue("User not authenticated");

    try {
        const response = await axiosConfig.post('cart/add', { productId, quantity });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        return rejectWithValue(error.response.data);
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().auth;
    if (!isAuthenticated) return rejectWithValue("User not authenticated");

    try {
        const response = await axiosConfig.delete(`cart/remove/${productId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data);
    }
});

export const decreaseCartItemQuantity = createAsyncThunk(
    'cart/decreaseCartItemQuantity',
    async (productId, { getState, rejectWithValue }) => {
        const { isAuthenticated } = getState().auth;
        if (!isAuthenticated) return rejectWithValue("User not authenticated");

        try {
            const response = await axiosConfig.patch('cart/decrease', { productId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.cart.items;
            })
            .addCase(decreaseCartItemQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
            });
    },
});

export default cartSlice.reducer;
