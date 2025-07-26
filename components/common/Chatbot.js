// components/ChatBot.js
import React from 'react';

const ChatBot = () => {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <iframe
        width="350"
        height="430"
        allow="microphone;"
        src="https://console.dialogflow.com/api-client/demo/embedded/904279ce-fdbc-493e-9bf7-99aa43a91fa0"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ChatBot;
