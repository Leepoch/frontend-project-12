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
        if (newChannel.id === '1') {
          newChannel.active = true;
        } else {
          newChannel.active = false;
        }
        state.entities[newChannel.id] = newChannel;
        state.ids.push(newChannel.id);
      });
    },
  },
});

export const { addChannels } = slice.actions;
export default slice.reducer;
