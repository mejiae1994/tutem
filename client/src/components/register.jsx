import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";

async function registerUser(formData) {
  try {
    const formJson = Object.fromEntries(formData.entries());
    const { status } = await axios.post(
      "http://localhost:5000/api/users/register",
      formJson
    );
    return status;
  } catch (error) {
    console.log("request failed");
    console.error(error);
  }
}

export default function Register() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const status = await registerUser(formData);
    if (status === 201) navigate("/");
    e.target.reset();
  }

  return (
    <div className="register modal">
      <form onSubmit={handleSubmit} method="post">
        <div className="username-input">
          <label htmlFor="">Username</label>
          <input
            type="username"
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
    </div>
  );
}
