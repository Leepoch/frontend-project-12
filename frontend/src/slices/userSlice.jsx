import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [],
  entities: {},
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(state, action) {
      const name = action.payload;
      state.entities.currentUser = { name };
      state.ids.push(name);
    },
  },
});

export const { addUser } = slice.actions;
export default slice.reducer;
