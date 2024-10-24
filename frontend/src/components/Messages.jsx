import React from 'react';
import { useSelector } from 'react-redux';
import filter from 'leo-profanity';

const Message = () => {
  const messageArray = [];
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messagesMain = useSelector((state) => state.messages);
  messagesMain.entities.forEach((key) => {
    if (messagesMain.entities[key].channelId === activeChannelId) {
      messageArray.push(messagesMain.entities[key]);
    }
  });
  return (
    <>
      {
        messageArray.map((item) => (
          <div key={item.id} className="text-break mb-2">
            <b>{item.username}</b>
            :
            {filter.clean(item.body)}
          </div>
        ))
}
    </>
  );
};
export default Message;
