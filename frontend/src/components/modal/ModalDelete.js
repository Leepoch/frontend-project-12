import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setIsOpenModal } from '../../slices/modalSlice.js';
import { removeChannel, setActiveChannelId } from '../../slices/channelsSlice.js';

export const ModalDelete = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);

  const handleClose = () => {
    dispatch(setIsOpenModal(false));
  };

  const handleDelete = async () => {
    const response = await axios.delete(`/api/v1/channels/${channels.activeChannelMenuId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch(removeChannel(response.data));
    dispatch(setIsOpenModal(false));
    dispatch(setActiveChannelId('1'));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fade modal show"
      tabIndex="-1"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h4">Удалить канал</div>
            <button
              onClick={handleClose}
              type="button"
              aria-label="Close"
              data-bs-dismiss="modal"
              className="btn btn-close"
            />
          </div>
          <div className="modal-body">
            <p className="lead">Уверены?</p>
            <div className="d-flex justify-content-end">
              <button
                onClick={handleClose}
                type="button"
                className="me-2 btn btn-secondary"
              >
                Отменить
              </button>
              <button
                onClick={handleDelete}
                type="button"
                className="btn btn-danger"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
