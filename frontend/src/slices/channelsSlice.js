import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ids: [],
  entities: {},
};

const slice = createSlice({
  name: "channels",
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
      state.entities[payload.channelId].messages.push(payload.messageId);
    },
    addMessagesToChannel(state, { payload }) {
      state.entities[payload.channelId].messages.push(...payload.messagesId);
    },
  },
});

export const {
  addChannels,
  addMessageToChannel,
  addMessagesToChannel
} = slice.actions;
export default slice.reducer;
