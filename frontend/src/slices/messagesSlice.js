import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const initialState = {
  ids: [],
  entities: {},
  currentMessage: '',
};

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages(state, action) {
      action.payload.forEach((message) => {
        state.ids.push(message.id);
        state.entities[message.id] = message;
      });
    },
    addMessage(state, action) {
      const message = action.payload;
      state.entities[message.id] = message;
      state.ids.push(message.id);
    },
    setCurrentMessage(state, { payload }) {
      state.currentMessage = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, { payload }) => {
        if (state.ids.length > 0) {
          state.ids.forEach((id) => {
            if (state.entities[id].channelId === payload.id) {
              delete state.entities[id];
            }
          });
        }
      });
  },
});

export const { addMessages, addMessage, setCurrentMessage } = slice.actions;
export default slice.reducer;
