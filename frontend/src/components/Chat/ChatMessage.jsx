import React from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.is_bot ? 'bot' : 'user'}`}>
      <div className="message-author">{message.is_bot ? 'Bot' : 'You'}</div>
      <div className="message-text">{message.text}</div>
    </div>
  );
};

export default ChatMessage;

  