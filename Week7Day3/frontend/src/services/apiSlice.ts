import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  // Point this to your working backend
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }), 
  tagTypes: ['User'], // Helps with auto-refreshing data
  endpoints: (builder) => ({
    // The Newsletter Mutation
    subscribeNewsletter: builder.mutation({
      query: (email: string) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: { email },
      }),
    }),
    // We will add Auth endpoints here next
  }),
});

// RTK Query auto-generates this hook for us!
export const { useSubscribeNewsletterMutation } = apiSlice;