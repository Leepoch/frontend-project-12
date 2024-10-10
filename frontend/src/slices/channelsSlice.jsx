import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [],
  entities: {},
  activeChannelId: '1',
  activeChannelMenuId: '',
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
    addChannel(state, { payload }) {
      state.entities[payload.id] = payload;
      state.entities[payload.id].messages = [];
      state.ids.push(payload.id);
    },
    removeChannel(state, { payload }) {
      delete state.entities[payload.id];
      state.ids = state.ids.filter((id) => id !== payload.id);
    },
    renameChannel(state, { payload }) {
      state.entities[payload.id].name = payload.name;
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
    },
    setActiveChannelMenuId(state, { payload }) {
      state.activeChannelMenuId = payload;
    },
  },
});

export const {
  addChannels,
  addChannel,
  addMessageToChannel,
  addMessagesToChannel,
  setActiveChannelId,
  setActiveChannelMenuId,
  removeChannel,
  renameChannel,
} = slice.actions;
export default slice.reducer;
