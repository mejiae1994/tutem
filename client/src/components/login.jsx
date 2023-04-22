import { useState, React, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";
import { getFormData } from "../utils/utils";

//refactor login component on
export default function Login() {
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const userData = getFormData(e.target);

    try {
      const { status, data } = await axiosRequest.post("users/login", userData);
      if (status === 200) {
        try {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          navigate("/home");
          setError(null);
        } catch (error) {
          console.log(error);
        }
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

  return (
    <div className="login modal">
      <h2>Credentials to Login</h2>
      <form onSubmit={handleSubmit} method="post">
        <div className="user-input">
          <label htmlFor="">Username</label>
          <input
            type="text"
            name="username"
            id=""
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="password-input">
          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            id=""
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Log in</button>

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
