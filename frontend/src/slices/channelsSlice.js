import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [],
  entities: {},
  activeChannelId: '1',
};

const slice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels(state, action) {
      action.payload.forEach((channel) => {
        const newChannel = { ...channel };
        if (!state.entities[newChannel.id]) {
          state.entities[newChannel.id] = newChannel;
          state.entities[newChannel.id].messages = [];
          state.ids.push(newChannel.id);
        }
      });
    },
    addMessageToChannel(state, { payload }) {
      state.entities[payload.channelId].messages.push(payload.id);
    },
    addMessagesToChannel(state, { payload }) {
      payload.forEach((message) => {
        state.entities[message.channelId].messages.push(message.id);
      });
    },
    setActiveChannelId(state, { payload }) {
      state.activeChannelId = payload;
    }
  },
});

export const {
  addChannels,
  addMessageToChannel,
  addMessagesToChannel,
  setActiveChannelId,
} = slice.actions;
export default slice.reducer;
