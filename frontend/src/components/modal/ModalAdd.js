import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import axios from 'axios';
import { addChannel, setActiveChannelId } from '../../slices/channelsSlice.js';
import { setIsOpenModal } from '../../slices/modalSlice.js';

export const ModalAdd = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const channelsNames = channels.ids.map((id) => channels.entities[id].name);
  const inputModal = useRef(null);

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
      const newChannel = {
        name: formik.values.name,
      };
      const response = await axios.post('/api/v1/channels', newChannel, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(addChannel(response.data));
      dispatch(setActiveChannelId(response.data.id));
      formik.values.name = '';
      dispatch(setIsOpenModal(false));
    },
  });

  useEffect(() => {
    inputModal.current.focus();
  }, []);

  const closeHandle = () => {
    dispatch(setIsOpenModal(false));
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
            <div className="modal-title h4">Добавить канал</div>
            <button
              type="button"
              aria-label="Close"
              data-bs-dismiss="modal"
              className="btn btn-close"
              onClick={closeHandle}
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
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="me-2 btn btn-secondary"
                    onClick={closeHandle}
                  >
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
