import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../../slices/channelsSlice.js';
import { setIsOpenModal } from '../../slices/modalSlice.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export const ModalRename = () => {
  const inputModal = useRef(null);
  const channels = useSelector((state) => state.channels);
  const currentChannelName = channels.entities[channels.activeChannelMenuId].name;
  const channelsNames = channels.ids.map((id) => channels.entities[id].name);
  const dispatch = useDispatch();

  useEffect(() => {
    inputModal.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'incorrect length')
        .max(20, 'incorrect length')
        .required('Required')
        .notOneOf(channelsNames, 'has copy'),
    }),
    onSubmit: async () => {
      const editedChannel = { name: formik.values.name };
      const response = await axios.patch(`/api/v1/channels/${channels.activeChannelMenuId}`,
        editedChannel,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      dispatch(renameChannel(response.data));
      dispatch(setIsOpenModal(false));
    },
  });

  const handleClose = () => {
    dispatch(setIsOpenModal(false));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fade modal show"
      tabIndex="-1"
      style={{display: 'block'}}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h4">Переименовать канал</div>
            <button
              type="button"
              aria-label="Close"
              data-bs-dismiss="modal"
              className="btn btn-close"
              onClick={handleClose}
            />
          </div>
          <div className="modal-body">
            <form className="" onSubmit={formik.handleSubmit}>
              <div>
                <input
                  ref={inputModal}
                  name="name"
                  id="name"
                  className="mb-2 form-control"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <label className="visually-hidden" htmlFor="name">
                  Имя канала
                </label>
                {formik.touched.name
                && formik.errors.name === 'incorrect length' ? null : (
                  <div className="invalid-feedback">От 3 до 20 символов</div>
                  )}
                {formik.touched.name
                && formik.errors.name === 'has copy' ? null : (
                  <div className="invalid-feedback">Должно быть уникальным</div>
                  )}
                <div className="invalid-feedback" />
                <div className="d-flex justify-content-end">
                  <button type="button" className="me-2 btn btn-secondary" onClick={handleClose}>
                    Отменить
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Отправить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
