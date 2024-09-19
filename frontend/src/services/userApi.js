import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'token',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/login' }),
  endpoints: (builder) => ({
    getToken: builder.mutation({
      query: (userData) => ({
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useGetTokenMutation } = userApi;
