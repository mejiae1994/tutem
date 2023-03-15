import { useState, React, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../App";
import axios from "axios";

async function logUser(formData) {
  const userData = Object.fromEntries(formData.entries());
  const res = await axios.post(
    "http://localhost:5000/api/users/login",
    userData
  );
  return res;
}

export default function Login() {
  const [userData, setUserData] = useState({
    username: undefined,
    password: undefined,
  });
  const [error, setError] = useState(null);
  const { setLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    //put the code below in a try catch block?

    try {
      const { status, data } = await logUser(formData);
      if (status === 200) {
        localStorage.setItem("user", JSON.stringify(data.details));
        setLogin(formData);
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
    const user = localStorage.getItem("user");
    console.log(user);
    setLoggedIn(user);
  }

  useEffect(() => {
    if (userData.username) {
      navigate("/dashboard", { state: { user: userData.username } });
    }
  });

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
