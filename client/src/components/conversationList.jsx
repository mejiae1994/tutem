import { React, useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";

export default function ConversationList() {
  const { user, setUser } = useContext(UserContext);
  const [conversationList, setConversationList] = useState([]);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const messageRef = useRef(null);

  function handleModal() {
    setIsMessagingOpen(!isMessagingOpen);
  }

  function scrollToBottom() {
    messageRef.current?.scrollIntoView({ bevahavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [conversationList, isMessagingOpen]);

  useEffect(() => {
    fetchMatches();
  }, [isMessagingOpen]);

  async function fetchMatches() {
    try {
      console.log("fetching conversation list");
      const { data } = await axiosRequest.get(`matches/${user._id}`);
      setConversationList(data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleConversation(e) {
    setIsMessagingOpen(!isMessagingOpen);
  }

  return isMessagingOpen ? (
    <div className="conversation-container">
      <div onClick={handleModal} className="collapse-modal">
        collapse
      </div>
      <div className="conversation-list">
        {conversationList ? (
          conversationList.map((item) => {
            return (
              <Link key={item._id} to={`/message/${item._id}`}>
                <div
                  onClick={(e) => handleConversation(e)}
                  className="conversation-item"
                  ref={messageRef}
                >
                  <img src={item.userPreferences.profileImg} alt="match icon" />
                  <div className="message-preview">
                    <span
                      style={{ fontWeight: "700" }}
                    >{`${item.username}:`}</span>
                    <span> {item.lastMessage?.content}</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div>There are no matches</div>
        )}
      </div>
    </div>
  ) : (
    <div onClick={handleModal} className="messaging-modal">
      Expand Message List
    </div>
  );
}
