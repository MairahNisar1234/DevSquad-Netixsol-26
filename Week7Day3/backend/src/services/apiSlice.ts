import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation({
      query: (email) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: { email },
      }),
      // Lifecycle Debugging
      async onQueryStarted(email, { queryFulfilled }) {
        console.log(`[RTK Query] Subscription started for: ${email}`);
        try {
          const { data } = await queryFulfilled;
          console.log('[RTK Query] Subscription Success:', data);
        } catch (err) {
          console.error('[RTK Query] Subscription Error:', err);
        }
      },
    }),
  }),
});

export const { useSubscribeToNewsletterMutation } = apiSlice;