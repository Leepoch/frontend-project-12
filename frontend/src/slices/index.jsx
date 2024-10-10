import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from '../services/chatApi.jsx';
import channelsReducer from './channelsSlice.jsx';
import messagesReducer from './messagesSlice.jsx';
import userReducer from './userSlice.jsx';
import modalReducer from './modalSlice.jsx';

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
