import { React, useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ConversationList from "./conversationList";
import { axiosRequest } from "../utils/axiosRequest";
import { UserContext } from "../context/UserProvider";

export default function Message() {
  const [eventSource, setEventSource] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const messageRef = useRef(null);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    let events;
    console.log(`establishing connection to recipient Id: ${id}`);
    events = new EventSource(`http://localhost:5000/api/messages/${id}`, {
      withCredentials: true,
    });

    setEventSource(events);

    events.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setMessageList(data);
    });

    return () => {
      if (events) {
        console.log(`closing connection to recipient Id: ${id}`);
        events.close();
        setEventSource(null);
      }
    };
  }, [id]);

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    createMessage();
    setMessage("");
    e.target.reset();
  }

  function scrollToBottom() {
    messageRef.current?.scrollIntoView({ bevahavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  async function createMessage() {
    try {
      const response = await axiosRequest.post(`messages`, {
        recipient: id,
        messageContent: message,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(date) {
    let formattedDate = new Date(date).toLocaleString();
    return formattedDate;
  }

  return (
    <>
      <div className="messaging-container">
        <div className="message-list">
          {messageList.map((message) => {
            return (
              <div className="message-item" key={message._id} ref={messageRef}>
                <span>{formatDate(message.createdAt)}</span>
                <div
                  className={
                    message.owner === user._id
                      ? "message-content owner"
                      : "message-content"
                  }
                >
                  <p>{message.content}</p>
                </div>
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
          <button type="submit">Send</button>
        </form>
      </div>
      <ConversationList />
    </>
  );
}
