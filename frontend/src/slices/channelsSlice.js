import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [],
  entities: {},
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
          state.ids.push(newChannel.id);
        }
      });
    },
    addMessageToChannel(state, action) {
      console.log(action.payload);
    }
  },
});

export const { addChannels, addMessageToChannel } = slice.actions;
export default slice.reducer;
