// orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../api/axiosConfig';

// Fetch orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await axiosConfig.get('orders');
    return response.data;
});

// Place order
export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData) => {
    const response = await axiosConfig.post('orders', orderData);
    return response.data;
});

// Cancel order
export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (orderId) => {
    const response = await axiosConfig.put(`orders/cancelUser/${orderId}`);
    console.log(response);
    return response.data;
});

// Make payment
export const makePayment = createAsyncThunk('orders/makePayment', async (orderId) => {
    const response = await axiosConfig.put(`orders/pay/${orderId}`);
    return response.data;
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: { items: [], loading: false, error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.items.push(action.payload); // Add the newly placed order to the list
                state.loading = false;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.items.findIndex(order => order._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(makePayment.fulfilled, (state, action) => {
                const index = state.items.findIndex(order => order._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            });
    },
});

export default orderSlice.reducer;
