import React from "react";
import SwipeList from "./swipeList";
import Messaging from "./messaging";

export default function Home() {
  return (
    <div className="home-container">
      <SwipeList />
      <Messaging />
    </div>
  );
}
