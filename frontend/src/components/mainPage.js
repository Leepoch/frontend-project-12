import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import io from 'socket.io-client';
import axios from 'axios';
import {
  useGetChannelsQuery,
  useGetMessagesQuery,
} from '../services/chatApi.js';
import {
  addChannels,
  addMessageToChannel,
  addMessagesToChannel,
  setActiveChannelId,
  setActiveChannelMenuId,
} from '../slices/channelsSlice.js';
import { addMessages, addMessage, setCurrentMessage } from '../slices/messagesSlice.js';
import { Modal } from './modal/Modal.js';
import { setChannelMenu, setIsOpenModal, setModalType } from '../slices/modalSlice.js';

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

  // const socket = io('ws://localhost:3000');

  // socket.on('newMessage', (payload) => {
  //   console.log(payload);
  // });

  useEffect(() => {
    inputChat.current.focus();
  }, [activeChannelId]);

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

    inputChat.current.focus();
    dispatch(setCurrentMessage(''));
  };

  const handleChoose = (e) => {
    dispatch(setActiveChannelId(e.target.id));
  };

  const handleChange = (e) => {
    dispatch(setCurrentMessage(e.target.value));
  };

  const handleChannelMenu = (e) => {
    dispatch(setChannelMenu(!modal.channelMenu));
    dispatch(setActiveChannelMenuId(e.target.id));
  };

  const handleAddChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('add'));
  };

  const handleDeleteChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('delete'));
    dispatch(setChannelMenu(false));
  };

  const handleRenameChannel = () => {
    dispatch(setIsOpenModal(true));
    dispatch(setModalType('rename'));
    dispatch(setChannelMenu(false));
  };

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">
                  Hexlet Chat
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={exitHandle}
                >
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
                    {channels.ids.length >= 1
                      && channels.ids.map((id) => {
                        const { channelMenu } = modal;
                        const activeMenuId = channels.activeChannelMenuId;
                        const channelClass = cn(
                          'w-100 rounded-0 text-start btn',
                          {
                            'btn-secondary': id === activeChannelId,
                          },
                        );
                        const groupClass = cn('d-flex dropdown btn-group', {
                          show: channelMenu && activeMenuId === id,
                        });
                        const buttonClass = cn(
                          'flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-secondary',
                          {
                            show: channelMenu && activeMenuId === id,
                          },
                        );
                        const menuClass = cn('dropdown-menu', {
                          show: channelMenu && activeMenuId === id,
                        });
                        const channelMenuClass = cn('flex-grow-0 dropdown-toggle dropdown-toggle-split btn', {
                          'btn-secondary': id === activeChannelId,
                        });
                        {
                          if (!channels.entities[id].removable) {
                            return (
                              <li className="nav-item w-100" key={id}>
                                <button
                                  type="button"
                                  className={channelClass}
                                  onClick={handleChoose}
                                  id={id}
                                >
                                  <span className="me-1">#</span>
                                  {channels.entities[id].name}
                                </button>
                              </li>
                            );
                          }
                        }
                        return (
                          <li className="nav-item w-100" key={id}>
                            <div role="group" className={groupClass}>
                              <button
                                type="button"
                                className={channelClass}
                                onClick={handleChoose}
                                id={id}
                              >
                                <span className="me-1">#</span>
                                {channels.entities[id].name}
                              </button>
                              <button
                                type="button"
                                id={id}
                                aria-expanded={channelMenu}
                                className={channelMenuClass}
                                onClick={handleChannelMenu}
                              >
                                <span className="visually-hidden">
                                  Управление каналом
                                </span>
                              </button>
                              <div
                                x-placement="bottom-end"
                                aria-labelledby="react-aria8879752112-:r0:"
                                className={menuClass}
                                data-popper-reference-hidden="false"
                                data-popper-escaped="false"
                                data-popper-placement="bottom-end"
                                style={{
                                  position: 'absolute',
                                  inset: '0px 0px auto auto',
                                  transform: 'translate(0px, 40px)',
                                }}
                              >
                                <a
                                  onClick={handleDeleteChannel}
                                  data-rr-ui-dropdown-item=""
                                  className="dropdown-item"
                                  role="button"
                                  tabIndex="0"
                                  href="#"
                                >
                                  Удалить
                                </a>
                                <a
                                  onClick={handleRenameChannel}
                                  data-rr-ui-dropdown-item=""
                                  className="dropdown-item"
                                  role="button"
                                  tabIndex="0"
                                  href="#"
                                >
                                  Переименовать
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b>
                          #
                          {' '}
                          {channels.ids.length > 0
                            && channels.entities[activeChannelId].name}
                        </b>
                      </p>
                      <span className="text-muted">
                        {messagesNumber}
                        {' '}
                        сообщений
                      </span>
                    </div>
                    <div
                      id="messages-box"
                      className="chat-messages overflow-auto px-5 "
                    >
                      {channels.ids.length > 0
                        && channels.entities[activeChannelId].messages.map(
                          (messageId) => {
                            const { username } = messages.entities[messageId];
                            const text = messages.entities[messageId].body;
                            return (
                              <div key={messageId} className="text-break mb-2">
                                <b>{username}</b>
                                :
                                {text}
                              </div>
                            );
                          },
                        )}
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
          <div className="Toastify" />
        </div>
      </div>
      {modal.isOpenModal ? <Modal /> : null}
    </>
  );
};

export default MainPage;
