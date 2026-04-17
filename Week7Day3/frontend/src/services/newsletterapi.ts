import { baseApi } from './baseApi';

export interface SubscribeRequest {
  email: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<SubscribeResponse, SubscribeRequest>({
      query: (body) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Newsletter'],
    }),
  }),
});

export const { useSubscribeMutation } = newsletterApi;