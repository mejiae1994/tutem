import { React, useState } from "react";
import "./userProfile.css";
import { getFormData } from "../utils/utils";
import { axiosRequest } from "../utils/axiosRequest";
// import profile from "../assets/profile.png";

// need to pull data from database and display it here, probably need to use Context
const dummyData = {
  username: "edison mejia",
  interest: "learn",
  profileImg:
    "https://thumbs.dreamstime.com/b/little-kid-avatar-profile-picture-boy-glasses-cartoon-character-portrait-isolated-vector-illustration-graphic-design-149134091.jpg",
  bio: "Greetings, I am a software developer who aims to deepen my understanding of JavaScript.",
};

export default function UserProfile({ userData }) {
  const { details, userPreferences } = userData;

  return (
    <>
      <div className="user-profile">
        <img
          className="user-img"
          src={userPreferences.profileImg}
          alt="profile Image"
        />
        <h1 className="username">{details.username}</h1>
        <h3 className="user-interest">{userPreferences.interest}</h3>
        <p>{userPreferences?.bio ? userPreferences.bio : "no user bio"}</p>
      </div>
      <Preferences />
    </>
  );
}

function Preferences() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    userPreferences: {
      interest: "",
      bio: "",
    },
  });

  //need to nest account for nested properties
  function handleChange(e) {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const userData = getFormData(e.target);
    console.log("logging from inside submit", userData);

    try {
      const res = await axiosRequest.put("64133e5b35f63b524eda156d", userData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(formData);
  return (
    <div className="preference modal">
      <h1>change profile information</h1>
      <br></br>
      <form onSubmit={handleSubmit} method="post">
        <div className="username-input">
          <label htmlFor="">Username</label>
          <input
            type="username"
            name="username"
            placeholder="enter new username"
            onChange={handleChange}
          />
        </div>
        <div className="email-input">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            placeholder="enter new email"
            onChange={handleChange}
          />
        </div>
        <div className="interest-select">
          <label htmlFor="interest"></label>
          <select name="interest" onChange={handleChange}>
            <option value="learn">learn</option>
            <option value="teach">teach</option>
          </select>
        </div>
        <div className="interest-input">
          <label htmlFor="">Interest</label>
          <textarea
            name="bio"
            placeholder="modify your bio"
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
