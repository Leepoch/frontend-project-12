import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { usePostMessageMutation, useGetChannelsQuery, useGetMessagesQuery } from '../services/chatApi.js';
import { addChannels } from '../slices/channelsSlice.js';
import { addMessages, addMessage } from '../slices/messagesSlice.js';


const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const channelsData = useGetChannelsQuery(token);
  const messagesData = useGetMessagesQuery(token);
  const [postMessage] = usePostMessageMutation();
  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);
  const [message, setMessage] = useState('');
  const [activeChannelId, setActiveChannelId] = useState('1');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    postMessage(localStorage.getItem('token'), {
      body: message,
      channelId: activeChannelId,
      username: localStorage.getItem('username'),
    }).unwrap().then((response) => {
      dispatch(addMessage({
        id: response.id,
        body: message,
        channelId: activeChannelId,
        username: localStorage.getItem('username'),
      }))
    }).catch((e) => console.log(e));
    console.log(messagesData)
  }

  console.log()
  const handleChange = (e) => {
    setMessage(e.target.value);
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
                      'btn-secondary': channels.entities[id] === activeChannelId,
                    });
                    return (
                      <li className="nav-item w-100" key={id}>    
                        <button
                          type="button"
                          className={channelClass}
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
                    <span className="text-muted">0 сообщений</span>
                  </div>
                  <div
                    id="messages-box"
                    className="chat-messages overflow-auto px-5 "
                  >
                    {/* {здесь цикл для вывода сообщений} */}
                    {}
                    <div className="text-break mb-2"><b>{
                      localStorage.getItem('username')
                      }</b>: message</div>
                    </div>
                  <div className="mt-auto px-5 py-3">
                    <form noValidate="" className="py-1 border rounded-2">
                      <div className="input-group has-validation">
                        <input
                          name="body"
                          aria-label="Новое сообщение"
                          placeholder="Введите сообщение..."
                          className="border-0 p-0 ps-2 form-control"
                          value={message}
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
