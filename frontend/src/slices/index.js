import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from '../services/chatApi.js';
import channelsReducer from './channelsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatApi.middleware),
});
