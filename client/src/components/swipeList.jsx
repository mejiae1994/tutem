import { React, useEffect, useState } from "react";
import { axiosRequest } from "../utils/axiosRequest";

export default function SwipeList() {
  const [userList, setUserList] = useState([]);
  const [swipe, setSwipe] = useState({
    rightSwipe: [],
    leftSwipe: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let swipes = 0;
    for (let s in swipe) {
      console.log(swipe[s].length);
      swipes += swipe[s].length;
    }
    if (swipes > 1) {
      console.log("swipe batching is done, need to send request");
      let status = postSwipe();
      if (status === 200) {
        setSwipe({});
      }
      // fetchUsers();
    }
  }, [swipe]);

  async function fetchUsers() {
    try {
      const { data } = await axiosRequest.get("filtered");
      setUserList(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postSwipe() {
    try {
      const { status } = await axiosRequest.put("swipe", swipe);
      return status;
    } catch (error) {
      console.log(error);
    }
  }
  //move the user we swiped on to either the rightswipe or leftswipe array
  function removeFromList(key) {
    const filteredList = userList.filter((item, index) => {
      return index !== key;
    });

    setUserList(filteredList);
  }

  function handleClick(e, key) {
    e.preventDefault();
    const swipedUser = userList[key];
    console.log(swipedUser);
    const { name } = e.target;
    setSwipe({ ...swipe, [name]: [...swipe[name], swipedUser] });
    removeFromList(key);
  }
  return (
    <div className="swipe-container">
      <h1>List of Available users</h1>
      {userList &&
        userList.map((user, key) => {
          return (
            <div className="user-card" key={key}>
              <span>{user.username}</span>
              <img src={user.userPreferences.profileImg} alt="profile image" />
              <p>{user.userPreferences.bio}</p>
              <button
                name="rightSwipe"
                className="right"
                onClick={(e) => handleClick(e, key)}
              >
                Swipe Right
              </button>
              <button
                name="leftSwipe"
                className="left"
                onClick={(e) => handleClick(e, key)}
              >
                Swipe Left
              </button>
            </div>
          );
        })}
    </div>
  );
}
