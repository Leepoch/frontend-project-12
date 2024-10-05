import React from 'react';
import { useSelector } from 'react-redux';

const Message = () => {
  const messageArray = [];
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messagesMain = useSelector((state) => state.messages);
  for (const key in messagesMain.entities) {
    if (messagesMain.entities[key].channelId == activeChannelId) {
      messageArray.push(messagesMain.entities[key]);
    }
  }
  return (
    <>
      {
        messageArray.map((item) => (
          <div key={item.id} className="text-break mb-2">
            <b>{item.username}</b>
            :
            {item.body}
          </div>
        ))
}
    </>
  );
};
export default Message;
