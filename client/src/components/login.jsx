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
      const { status, data } = await axiosRequest.post("login", userData);
      if (status === 200) {
        try {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          navigate("/");
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
      <form onSubmit={handleSubmit} method="post">
        <div className="email-input">
          <label htmlFor="">username</label>
          <input
            type="text"
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
