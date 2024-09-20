import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const slice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        addChannel: channelsAdapter.addOne,
        addChannels: channelsAdapter.addMany,
    }
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { addChannel, addChannels } = slice.actions;
export default slice.reducer;