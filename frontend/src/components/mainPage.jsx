import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import {
  useGetChannelsQuery,
  useGetMessagesQuery,
} from '../services/chatApi.jsx';
import {
  addChannels,
  addMessageToChannel,
  addMessagesToChannel,
} from '../slices/channelsSlice.jsx';
import { addMessages, addMessage, setCurrentMessage } from '../slices/messagesSlice.jsx';
import { Modal } from './modal/Modal.jsx';
import Messages from './Messages.jsx';
import { setIsOpenModal, setModalType } from '../slices/modalSlice.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { Channels } from './Channels.jsx';

const socket = io('ws://localhost:3000');

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const channelsData = useGetChannelsQuery(token);
  const messagesData = useGetMessagesQuery(token);
  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);
  const modal = useSelector((state) => state.modal);
  const activeChannelId = useSelector(
    (state) => state.channels.activeChannelId,
  );
  const [messagesNumber, setMessagesNumber] = useState(0);
  const inputChat = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });
  }, []);

  useEffect(() => {
    inputChat.current.focus();
  }, [activeChannelId]);

  useEffect(() => {
    if (channels.ids.length > 0) {
      setMessagesNumber(channels.entities[activeChannelId].messages.length);
    }
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (channelsData.isSuccess) {
      dispatch(addChannels(channelsData.data));
    }
    if (messagesData.isSuccess) {
      dispatch(addMessages(messagesData.data));
      dispatch(addMessagesToChannel(messagesData.data));
    }
  }, [channelsData.isSuccess, messagesData.isSuccess]);

  const exitHandle = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (messages.currentMessage.length > 0) {
      const newMessage = {
        body: messages.currentMessage,
        channelId: activeChannelId,
        username: localStorage.getItem('username'),
      };
      const response = await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(addMessage(response.data));
      dispatch(addMessageToChannel(response.data));
      setMessagesNumber(channels.entities[activeChannelId].messages.length);
      inputChat.current.focus();
      dispatch(setCurrentMessage(''));
    }
  };

  const handleChange = (e) => {
    dispatch(setCurrentMessage(e.target.value));
  };

  const handleAddChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('add'));
  };

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">
                  {t('hexletTextLogo')}
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={exitHandle}
                >
                  {t('mainPage.exitBtn')}
                </button>
              </div>
            </nav>
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                    <b>{t('mainPage.channels')}</b>
                    <button
                      type="button"
                      className="p-0 text-primary btn btn-group-vertical"
                      onClick={handleAddChannel}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                      </svg>
                      <span className="visually-hidden">+</span>
                    </button>
                  </div>
                  <ul
                    id="channels-box"
                    className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
                  >
                    <Channels />
                  </ul>
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b>
                          {t('mainPage.grid')}
                          {' '}
                          {channels.ids.length > 0
                            && channels.entities[activeChannelId].name}
                        </b>
                      </p>
                      <span className="text-muted">
                        {messagesNumber}
                        {' '}
                        {t('mainPage.messagesCount')}
                      </span>
                    </div>
                    <div
                      id="messages-box"
                      className="chat-messages overflow-auto px-5 "
                    >
                      <Messages />
                    </div>
                    <div className="mt-auto px-5 py-3">
                      <form noValidate="" className="py-1 border rounded-2">
                        <div className="input-group has-validation">
                          <input
                            ref={inputChat}
                            name="body"
                            aria-label="Новое сообщение"
                            placeholder="Введите сообщение..."
                            className="border-0 p-0 ps-2 form-control"
                            value={messages.currentMessage}
                            onChange={handleChange}
                          />
                          <button
                            type="submit"
                            disabled=""
                            className="btn btn-group-vertical"
                            onClick={handleSubmit}
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
          <ToastContainer />
        </div>
      </div>
      {modal.isOpenModal ? <Modal /> : null}
    </>
  );
};

export default MainPage;
