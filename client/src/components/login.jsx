import { useState, useContext, React } from "react";
import { LoginContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

async function logUser(formData) {
  try {
    const userData = Object.fromEntries(formData.entries());
    const res = await axios.post(
      "http://localhost:5000/api/users/login",
      userData
    );
    return res;
  } catch (error) {
    console.log("login failed");
    console.error(error);
  }
}

export default function Login() {
  const [userData, setUserData] = useState({
    username: undefined,
    password: undefined,
  });
  const { setLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    //put the code below in a try catch block?
    const { status, data } = await logUser(formData);
    if (status === 200) {
      localStorage.setItem("user", JSON.stringify(data.details));
      setLoggedIn(true);
      navigate("/dashboard");
    }
    setLogin(formData);
    console.log(status);
  }

  function setLogin(formData) {
    const { username, password } = Object.fromEntries(formData.entries());

    setUserData((prev) => ({
      ...prev,
      username: username,
      password: password,
    }));
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
      </form>
    </div>
  );
}
