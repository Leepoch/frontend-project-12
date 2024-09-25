import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'token',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  endpoints: (builder) => ({
    getToken: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
    }),
    getChannels: builder.query({
      query: (token) => ({
        url: '/channels',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getMessages: builder.query({
      query: (token) => ({
        url: '/messages',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    postMessage: builder.mutation({
      query: (token, message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    signupUser: builder.mutation({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    })
  }),
});

export const {
  useGetTokenMutation,
  useGetChannelsQuery,
  useGetMessagesQuery,
  usePostMessageMutation,
  useSignupUserMutation,
} = chatApi;
