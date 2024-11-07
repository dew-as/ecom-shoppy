// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishListSlice';
import orderReducer from './slices/orderSlice'; // Import orderSlice

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer, // Add orderReducer here
    },
});

export default store;
