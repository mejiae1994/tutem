import React from "react";
import SwipeList from "./swipeList";
import ConversationList from "./conversationList";

export default function Home() {
  return (
    <div className="home-container">
      <SwipeList />
      <ConversationList />
    </div>
  );
}
