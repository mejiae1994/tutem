import { React, useEffect, useState } from "react";
import { axiosRequest } from "../utils/axiosRequest";
import thumbupImg from "../assets/up-50.png";
import thumbdownImg from "../assets/down-50.png";
import ReactCardFlip from "react-card-flip";

export default function SwipeList() {
  const [userList, setUserList] = useState([]);
  const [swipe, setSwipe] = useState({
    rightSwipe: [],
    leftSwipe: [],
  });
  const [flipList, setFlipList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let swipes = 0;
    for (let s in swipe) {
      swipes += swipe[s].length;
    }

    if (swipes > 0) {
      console.log("swipe batching is done, need to send request");
      let status = postSwipe();
      if (status === 200) {
        setSwipe({});
      }
      //make sure to fetch the latest after every batch is cleared
      // fetchUsers();
    }
  }, [swipe]);

  async function fetchUsers() {
    try {
      const { data } = await axiosRequest.get("users/filtered");
      setUserList(data);
      setFlipList(new Array(data.length).fill(0));
    } catch (error) {
      console.log(error);
    }
  }

  async function postSwipe() {
    try {
      const { status } = await axiosRequest.put("users/swipe", swipe);
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
    const { name } = e.currentTarget;
    setSwipe({ ...swipe, [name]: [...swipe[name], swipedUser] });
    removeFromList(key);
  }

  function handleFlip(e, key) {
    let newArray = flipList.slice();
    newArray[key] = Number(!newArray[key]);
    setFlipList(newArray);
  }

  return (
    <div className="swipe-container">
      <h1>List of Available users</h1>
      {userList &&
        userList.map((user, key) => {
          return (
            <div className="user-card" key={key}>
              <ReactCardFlip isFlipped={flipList[key]}>
                <img
                  className="swipe-profile-img"
                  onMouseOver={(e) => handleFlip(e, key)}
                  src={user.userPreferences.profileImg}
                  alt="profile image"
                />

                <div
                  className="user-content"
                  onMouseLeave={(e) => handleFlip(e, key)}
                >
                  <h1>{user.username}</h1>
                  <p>{user.userPreferences.bio}</p>
                </div>
              </ReactCardFlip>
              <div className="swipes">
                <a
                  name="leftSwipe"
                  className="left"
                  onClick={(e) => handleClick(e, key)}
                >
                  <img src={thumbdownImg} alt="thumbs down" />
                </a>
                <a
                  name="rightSwipe"
                  className="right"
                  onClick={(e) => handleClick(e, key)}
                >
                  <img src={thumbupImg} alt="thumbs up" />
                </a>
              </div>
            </div>
          );
        })}
    </div>
  );
}
