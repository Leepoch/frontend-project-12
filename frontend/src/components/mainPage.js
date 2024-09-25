import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/chatApi.js';
import { addChannels, addMessageToChannel, addMessagesToChannel } from '../slices/channelsSlice.js';
import { addMessages, addMessage } from '../slices/messagesSlice.js';
import io from 'socket.io-client'
import axios from 'axios';


const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const channelsData = useGetChannelsQuery(token);
  const messagesData = useGetMessagesQuery(token);
  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);
  const [activeChannelId, setActiveChannelId] = useState('1');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messagesNumber, setMessagesNumber] = useState(0);
  const inputChat = useRef(null);

  // const socket = io('ws://localhost:3000');

  // socket.on('newMessage', (payload) => {
  //   console.log(payload);
  // });

  useEffect(() => {
    inputChat.current.focus();
  }, [])

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (channelsData.isSuccess) {
      dispatch(addChannels(channelsData.data));
    }
    if (messagesData.isSuccess) {
      dispatch(addMessages(messagesData.data));
    }
  }, [channelsData.isSuccess, messagesData.isSuccess]);

  const exitHandle = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    inputChat.current.focus();
    setCurrentMessage('');

    const newMessage = {
      body: currentMessage,
      channelId: activeChannelId,
      username: localStorage.getItem('username'),
    }
    const response = await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
    dispatch(addMessage(response.data));
    dispatch(addMessageToChannel({
      channelId: response.data.channelId,
      messageId: response.data.id,
    }))
    setMessagesNumber(channels.entities[activeChannelId].messages.length);
  }

  const handleChoose = (e) => {
    setActiveChannelId(e.target.id);
  }

  const handleChange = (e) => {
    setCurrentMessage(e.target.value);
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
                  {channels.ids.length >= 1 && channels.ids.map((id) => {
                    const channelClass = cn('w-100 rounded-0 text-start btn', {
                      'btn-secondary': id === activeChannelId,
                    });
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
                  })}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b># {channels.ids.length > 0 && channels.entities[activeChannelId].name}</b>
                    </p>
                    <span className="text-muted">
                      {messagesNumber} сообщений
                    </span>
                  </div>
                  <div
                    id="messages-box"
                    className="chat-messages overflow-auto px-5 "
                  >
                    {messages.ids.length > 0 && messages.ids.map((messageId) => {
                      const username = messages.entities[messageId].username;
                      const text = messages.entities[messageId].body;
                      return <div key={messageId} className="text-break mb-2"><b>{username}</b>: {text}</div>
                    })}
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
                          value={currentMessage}
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
  );
};

export default MainPage;
