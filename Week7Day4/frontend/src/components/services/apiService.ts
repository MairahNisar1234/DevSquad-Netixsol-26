import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type CartItem = {
  productId: string; // ✅ matches backend CartService exactly
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
};

type CartResponse = {
  items: CartItem[];
  totalPrice: number;
};

export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://week7backend-eight.vercel.app' }),

  tagTypes: ['Cart', 'Products'],

  endpoints: (builder) => ({

    // =========================
    // PRODUCTS
    // =========================
    getProducts: builder.query<any[], void>({
      query: () => '/products',

      providesTags: ['Products'],

      async onQueryStarted(_, { queryFulfilled }) {
        console.log('📡 [PRODUCTS] Fetch started');
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [PRODUCTS] Fetch success:', data?.length);
        } catch (err) {
          console.error('❌ [PRODUCTS] Fetch failed:', err);
        }
      },
    }),

    // =========================
    // CART QUERY
    // =========================
    getCart: builder.query<CartResponse, void>({
      query: () => '/cart',

      providesTags: (result) =>
        result
          ? [
              { type: 'Cart', id: 'LIST' },
              ...result.items.map((item) => ({
                type: 'Cart' as const,
                id: item.productId, // ✅ fixed
              })),
            ]
          : [{ type: 'Cart', id: 'LIST' }],

      async onQueryStarted(_, { queryFulfilled }) {
        console.log('📡 [CART QUERY] Fetch started');
        try {
          const { data } = await queryFulfilled;
          console.log('✅ [CART QUERY] Fetch success');
          console.log('🧾 Items count:', data?.items?.length);
          console.log('💰 Total price:', data?.totalPrice);
          console.log('📦 Full cart:', data);
        } catch (err) {
          console.error('❌ [CART QUERY] Fetch failed:', err);
        }
      },
    }),

    // =========================
    // ADD TO CART
    // =========================
    addToCart: builder.mutation<any, any>({
      query: (product) => ({
        url: '/cart/add',
        method: 'POST',
        body: product,
      }),

      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],

      async onQueryStarted(product, { queryFulfilled }) {
        console.log('📡 [ADD TO CART] Request sent');
        console.log('➡️ Product:', product);
        try {
          const res = await queryFulfilled;
          console.log('✅ [ADD TO CART] Success response:', res.data);
        } catch (err) {
          console.error('❌ [ADD TO CART] Failed:', err);
        }
      },
    }),

    // =========================
    // UPDATE QUANTITY
    // =========================
    updateQuantity: builder.mutation<any, any>({
      query: (payload) => ({
        url: '/cart/update',
        method: 'PATCH',
        body: payload,
      }),

      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],

      async onQueryStarted(payload, { queryFulfilled }) {
        console.log('📡 [UPDATE CART] Request:', payload);
        try {
          const res = await queryFulfilled;
          console.log('✅ [UPDATE CART] Success:', res.data);
        } catch (err) {
          console.error('❌ [UPDATE CART] Failed:', err);
        }
      },
    }),

    // =========================
    // REMOVE FROM CART
    // =========================
    removeFromCart: builder.mutation<any, string>({
      query: (productId) => {
        console.log('🗑️ [REMOVE FROM CART] Sending DELETE for productId:', productId);
        return {
          url: `/cart/${productId}`, // ✅ now sends the real productId
          method: 'DELETE',
        };
      },

      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],

      async onQueryStarted(id, { queryFulfilled }) {
        console.log('📡 [REMOVE FROM CART] ID:', id);
        try {
          const res = await queryFulfilled;
          console.log('✅ [REMOVE FROM CART] Success:', res.data);
        } catch (err) {
          console.error('❌ [REMOVE FROM CART] Failed:', err);
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveFromCartMutation,
} = apiService;