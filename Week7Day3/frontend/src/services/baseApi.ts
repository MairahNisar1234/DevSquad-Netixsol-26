import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const baseApi = createApi({
  reducerPath: 'api',
  // Set this to your NestJS backend URL
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001', 
    prepareHeaders: (headers, { getState }) => {
      // Automatically pull the token from your auth slice for every request
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Newsletter', 'Market'], // Helps with automatic data refreshing
  endpoints: () => ({}), // Start empty; endpoints are injected by other files
});