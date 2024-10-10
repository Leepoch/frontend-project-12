import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenModal: false,
  modalType: '',
  channelMenu: false,
  activeChannelMenu: null,
};

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setIsOpenModal(state, { payload }) {
      state.isOpenModal = payload;
    },
    setModalType(state, { payload }) {
      state.modalType = payload;
    },
    setChannelMenu(state, { payload }) {
      state.channelMenu = payload;
    },
  },
});

export const { setIsOpenModal, setModalType, setChannelMenu } = slice.actions;
export default slice.reducer;
