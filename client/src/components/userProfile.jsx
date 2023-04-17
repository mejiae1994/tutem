import { React, useState, useContext, useEffect } from "react";
import "./userProfile.css";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";
import axios from "axios";

export default function UserProfile({ userData }) {
  const { userPreferences, ...details } = userData;
  //need to just use the user data from context
  const { user, setUser } = useContext(UserContext);

  function handleFile(e) {
    uploadFile(e.target.files[0]);
  }

  async function uploadFile(image) {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "tutem2023");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkx7krtsv/image/upload",
        data
      );

      const { url } = uploadRes.data;

      const postUrl = {
        userPreferences: {
          profileImg: url,
        },
      };

      try {
        const { status, data } = await axiosRequest.put(
          `users/${user._id}`,
          postUrl
        );
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        console.log("image change success");
      } catch (error) {
        console.log(error);
        setStatus("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="dashboard-content">
      <div className="user-profile">
        <input type="file" onChange={handleFile}></input>
        <img
          className="user-img"
          src={userPreferences.profileImg}
          alt="profile Image"
        />
        <h1 className="username">{details.username}</h1>
        <h3 className="user-role">{userPreferences.role}</h3>
        <p>{userPreferences?.bio ? userPreferences.bio : "no user bio"}</p>
        <div className="current-interests">
          <h3>Current Interests highlighted</h3>
          <ul>
            {details.interests.map((interest, index) => {
              let description = Object.entries(interest)[1][1];
              let enabled = Object.entries(interest)[2][1];

              return (
                <li key={index} className={enabled ? "cli-selected" : ""}>
                  {description}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Preferences />
    </div>
  );
}

function Preferences() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    userPreferences: {
      role: "",
      bio: "",
    },
    interests: [],
  });
  const [userInterests, setUserInterests] = useState([]);
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

    if (formData.email !== "" && !isValidEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

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

  useEffect(() => {
    setUserInterests(user.interests);
  }, []);

  function handleInterestSelect(e, id) {
    setUserInterests(
      userInterests.map((int) => {
        if (int._id === id) {
          return {
            ...int,
            enabled: Number(!int.enabled),
          };
        }
        return int;
      })
    );

    setFormData((prevState) => ({
      ...prevState,
      interests: userInterests.map((int) => {
        if (int._id === id) {
          return {
            ...int,
            enabled: Number(!int.enabled),
          };
        }
        return int;
      }),
    }));
  }

  function isValidEmail(email) {
    // regex pattern to validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <div className="modal preference">
      <h2>Change profile information</h2>
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
        <div className="role-select">
          <label htmlFor="role">Role</label>
          <select name="role" onChange={handleChange}>
            <option value="Pupil">Pupil</option>
            <option value="Educator">Educator</option>
          </select>
        </div>
        <div className="bio-input">
          <label htmlFor="">Personal bio</label>
          <textarea
            name="bio"
            placeholder="modify your bio"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="user-interests">
          <label htmlFor="">Interests</label>
          <ul>
            {userInterests.map((interest) => {
              let description = Object.entries(interest)[1][1];
              let enabled = Object.entries(interest)[2][1];

              return (
                <li
                  onClick={(e) => handleInterestSelect(e, interest._id)}
                  key={interest._id}
                  className={enabled ? "li-selected" : ""}
                >
                  {description}
                </li>
              );
            })}
          </ul>
        </div>
        <button type="submit">Save Changes</button>
        <span>{status && status}</span>
      </form>
    </div>
  );
}
