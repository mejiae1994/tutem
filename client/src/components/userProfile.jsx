import React from "react";
import "./userProfile.css";
// import profile from "../assets/profile.png";

// need to pull data from database and display it here, probably need to use Context
const dummyData = {
  username: "edison mejia",
  interest: "learn",
  profileImg:
    "https://thumbs.dreamstime.com/b/little-kid-avatar-profile-picture-boy-glasses-cartoon-character-portrait-isolated-vector-illustration-graphic-design-149134091.jpg",
  bio: "Greetings, I am a software developer who aims to deepen my understanding of JavaScript.",
};

export default function UserProfile() {
  return (
    <div className="user-profile">
      <img
        className="user-img"
        src={dummyData.profileImg}
        alt="profile Image"
      />
      <h1 className="username">{dummyData.username}</h1>
      <h3 className="user-interest">{dummyData.interest}</h3>
      <p>{dummyData.bio}</p>
    </div>
  );
}
