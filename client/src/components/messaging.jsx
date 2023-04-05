import { React, useState } from "react";

export default function Messaging() {
  const [messageList, setMessageList] = useState({});
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const messages = [
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
    { user: "konedi", message: "This is a test message", timeStamp: 0 },
    { user: "konedi", message: "This is a test message as well", timeStamp: 1 },
    { user: "kayra", message: "This is a test message yes", timeStamp: 2 },
  ];

  function handleModal() {
    setIsMessagingOpen(!isMessagingOpen);
  }

  console.log(isMessagingOpen);
  return isMessagingOpen ? (
    <div className="messaging-container">
      <div onClick={handleModal} className="collapse-modal">
        collapse
      </div>
      <div className="message-list">
        {messages.map((item, index) => {
          return (
            <div className="message-item" key={index}>
              <div className="message-owner">
                <span>{item.user}: </span> <span>{item.timeStamp}</span>
              </div>
              <p>{item.message}</p>
            </div>
          );
        })}
      </div>
      <div className="submit-area">
        <textarea placeholder="Write a message..."></textarea>
        <button onClick={() => console.log("sending message")}>
          Send Message
        </button>
      </div>
    </div>
  ) : (
    <div onClick={handleModal} className="message-modal">
      Expand Message list
    </div>
  );
}
