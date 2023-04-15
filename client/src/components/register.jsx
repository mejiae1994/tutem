import { axiosRequest } from "../utils/axiosRequest";
import { React, useState } from "react";
import { getFormData } from "../utils/utils";

export default function Register() {
  const [sucess, setSucess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const userData = getFormData(e.target);
    const response = await registerUser(userData);
    if (response?.status === 201) {
      setSucess("Sucessfull Registration!");
    }
    e.target.reset();
  }

  async function registerUser(formData) {
    try {
      const response = await axiosRequest.post("users/register", formData);
      return response;
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <div className="register modal">
      <form onSubmit={handleSubmit} method="post">
        <div className="user-input">
          <label htmlFor="">Username</label>
          <input
            type="text"
            name="username"
            id=""
            placeholder="Enter your username"
          />
        </div>
        <div className="email-input">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            id=""
            placeholder="Enter your email"
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
        <button type="submit">Register</button>
      </form>
      {sucess && (
        <div
          style={{
            color: "green",
            margin: "1rem",
          }}
        >
          {sucess}
        </div>
      )}
      {error && (
        <div
          style={{
            color: "red",
            margin: "1rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
