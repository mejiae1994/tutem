import { useState, React, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import axios from "axios";

async function logUser(formData) {
  const userData = Object.fromEntries(formData.entries());
  const res = await axios.post(
    "http://localhost:5000/api/users/login",
    userData
  );
  console.log("before local storage");
  localStorage.setItem("user", JSON.stringify(res.data.details));
  console.log("after local storage");
  return res;
}

//refactor login component on
export default function Login() {
  const [userData, setUserData] = useState({
    username: undefined,
    password: undefined,
  });
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    //put the code below in a try catch block?

    try {
      const { status, data } = await logUser(formData);
      if (status === 200) {
        console.log("after return and localstorage");
        const { details, userPreferences } = data;
        console.log(details, userPreferences);
        try {
          setUser(details);
          console.log("after set user");
        } catch (error) {
          console.log(error);
        }
        navigate("/");
        setError(null);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setError("Invalid username");
      } else if (error.response.status === 400) {
        setError("wrong password");
      } else {
        setError(error);
      }
    }
  }

  function setLogin(formData) {
    const { username, password } = Object.fromEntries(formData.entries());

    setUserData((prev) => ({
      ...prev,
      username: username,
      password: password,
    }));

    // console.log(`showing the user data from set login: ${user}`);
  }

  return (
    <div className="login modal">
      <form onSubmit={handleSubmit} method="post">
        <div className="email-input">
          <label htmlFor="">username</label>
          <input
            type="username"
            name="username"
            id=""
            placeholder="Enter your username"
          />
        </div>
        <div className="password-input">
          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            id=""
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Continue</button>

        <span
          style={{
            color: "red",
            fontSize: "1rem",
            fontWeight: 400,
          }}
        >
          {error}
        </span>
      </form>
    </div>
  );
}
