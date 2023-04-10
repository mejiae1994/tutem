import { React, useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ConversationList from "./conversationList";

const messages = [
  {
    user: "konedi",
    messageContent: "This is a test message",
    timeStamp: 0,
    id: 0,
  },
  {
    user: "konedi",
    messageContent: "This is a test message as well",
    timeStamp: 1,
    id: 0,
  },
  {
    user: "kayra",
    messageContent: "This is a test message yes",
    timeStamp: 2,
    id: 1,
  },
  {
    user: "konedi",
    messageContent: "This is a test message",
    timeStamp: 0,
    id: 0,
  },
  {
    user: "konedi",
    messageContent: "This is a test message as well",
    timeStamp: 1,
    id: 0,
  },
  {
    user: "kayra",
    messageContent: "This is a test message yes",
    timeStamp: 1,
    id: 1,
  },
  {
    user: "kayra",
    messageContent: "This is a test message yes",
    timeStamp: 2,
    id: 1,
  },
  {
    user: "kayra",
    messageContent: "This is a test message yes",
    timeStamp: 3,
    id: 1,
  },
  {
    user: "Laura",
    messageContent: "This is a test message yes",
    timeStamp: 1,
    id: 2,
  },
  {
    user: "Laura",
    messageContent: "This is a test message yes",
    timeStamp: 4,
    id: 2,
  },
  {
    user: "Laura",
    messageContent: "This is a test message yes",
    timeStamp: 3,
    id: 2,
  },
  {
    user: "Laura",
    messageContent: "This is a test message yes",
    timeStamp: 2,
    id: 2,
  },
];

export default function Message() {
  const [messageList, setMessageList] = useState(messages);
  const [message, setMessage] = useState("");
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const messageRef = useRef(null);
  const location = useLocation();

  function handleModal() {
    setIsMessagingOpen(!isMessagingOpen);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessageList([
      ...messageList,
      { user: "test", messageContent: message, timeStamp: 3 },
    ]);
    setMessage("");
    e.target.reset();
  }

  function scrollToBottom() {
    messageRef.current?.scrollIntoView({ bevahavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messageList, isMessagingOpen]);

  return (
    <>
      <div className="messaging-container">
        <div className="message-list">
          {messageList
            .filter((item) => item.id === location.state.id)
            .map((item, index) => {
              return (
                <div className="message-item" key={index} ref={messageRef}>
                  <div className="message-owner">
                    <span>{item.user}: </span> <span>{item.timeStamp}</span>
                  </div>
                  <p>{item.messageContent}</p>
                </div>
              );
            })}
        </div>
        <form className="submit-area" onSubmit={handleSubmit} method="post">
          <textarea
            name="message"
            placeholder="Write a message..."
            onChange={handleChange}
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
      <ConversationList />
    </>
  );
}
