import { React, useState, useContext } from "react";
import "./userProfile.css";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";

export default function UserProfile({ userData }) {
  const { userPreferences, ...details } = userData;

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
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    userPreferences: {
      interest: "",
      bio: "",
    },
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    if (Object.keys(formData.userPreferences).includes(name)) {
      setFormData((prevState) => ({
        ...prevState,
        userPreferences: {
          ...prevState.userPreferences,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { status, data } = await axiosRequest.put(
        `users/${user._id}`,
        formData
      );
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setStatus("Changes saved successfully");
    } catch (error) {
      console.log(error);
      setStatus("Something went wrong");
    }

    e.target.reset();
  }

  return (
    <div className="preference modal">
      <h1>change profile information</h1>
      <br></br>
      <form onSubmit={handleSubmit} method="post">
        <div className="username-input">
          <label htmlFor="">Username</label>
          <input
            type="text"
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
        <span>{status && status}</span>
      </form>
    </div>
  );
}
