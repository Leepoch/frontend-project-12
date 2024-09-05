import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk, 
} from '@reduxjs/toolkit';
import axios from 'axios';

const userAdapter = createEntityAdapter();

export const fetchUserToken = createAsyncThunk(
  'fetchUserToken',
  async ({ username, password }) => {

    const response = await axios.post('/api/v1/login', { username, password });
    return response.data;
  }
);

const loginSlice = createSlice({
  name: 'auth',
  initialState: userAdapter.getInitialState(),
  reducers: {
    addToken: userAdapter.addOne,//Оставляем?
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserToken.fulfilled, (state, action) => {
        userAdapter.addOne(state, action);
        localStorage.setItem('token', action.payload.token)
        state.loadingStatus = 'idle';
      })
      .addCase(fetchUserToken.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
});

export const { addToken } = loginSlice.actions;

export default loginSlice.reducer;
