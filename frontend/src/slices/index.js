import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from '../services/chatApi.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import userReducer from './userSlice.js';
import modalReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatApi.middleware),
});
