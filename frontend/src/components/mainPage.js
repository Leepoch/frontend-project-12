import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery } from '../services/chatApi.js';
import { useDispatch, useSelector } from 'react-redux';
import { addChannels } from '../slices/channelsSlice.js';

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { data, isSuccess } = useGetChannelsQuery(token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (isSuccess) {
      dispatch(addChannels(data));
    }
  }, []);
  

  const { entities, ids } = useSelector((state) => state.channels);
  console.log(ids);

  const exitHandle = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
              <button type="button" className="btn btn-primary" onClick={exitHandle}>
                Выйти
              </button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>Каналы</b>
                  <button
                    type="button"
                    className="p-0 text-primary btn btn-group-vertical"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="" />
                      <path d="" />
                    </svg>
                    <span className="visually-hidden">+</span>
                  </button>
                </div>
                <ul
                  id="channels-box"
                  className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
                >
                  {ids.length >= 1 && ids.map((id) => {
                    <li className="nav-item w-100">
                    <button
                      type="button"
                      className="w-100 rounded-0 text-start btn btn-secondary"
                    >
                      <span className="me-1">#</span>
                      {entities[id].name}
                    </button>
                  </li>
                  })}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b># general</b>
                    </p>
                    <span className="text-muted">0 сообщений</span>
                  </div>
                  <div
                    id="messages-box"
                    className="chat-messages overflow-auto px-5 "
                  />
                  <div className="mt-auto px-5 py-3">
                    <form noValidate="" className="py-1 border rounded-2">
                      <div className="input-group has-validation">
                        <input
                          name="body"
                          aria-label="Новое сообщение"
                          placeholder="Введите сообщение..."
                          className="border-0 p-0 ps-2 form-control"
                          value=""
                        />
                        <button
                          type="submit"
                          disabled=""
                          className="btn btn-group-vertical"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="20"
                            height="20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="" />
                          </svg>
                          <span className="visually-hidden">Отправить</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default MainPage;
