import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ids: [],
    entities: {},
};

const slice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        addChannels(state, action) {
            action.payload.forEach(channel => {
                state.entities[channel.id] = channel;
                state.ids.push(channel.id);
            });
        },
    }
});

export const { addChannels } = slice.actions;
export default slice.reducer;