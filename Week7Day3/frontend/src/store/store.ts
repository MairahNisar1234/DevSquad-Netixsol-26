import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';
import authReducer from '../services/authSlice'; // 1. Import your authSlice reducer

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer, // 2. Add the "auth" key here!
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;