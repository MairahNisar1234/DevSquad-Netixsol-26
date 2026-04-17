import { baseApi } from './baseApi';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    googleId?: string;
    createdAt: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId?: string;
  createdAt: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    googleAuth: builder.mutation<AuthResponse, { token: string }>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGoogleAuthMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;