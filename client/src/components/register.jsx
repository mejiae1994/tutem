import axios from "axios";
import React from "react";

async function registerUser(formData) {
  try {
    const formJson = Object.fromEntries(formData.entries());
    const response = await axios.post(
      "http://localhost:5000/api/users",
      formJson
    );
    console.log(response.data);
  } catch (error) {
    console.log("request failed");
    console.error(error);
  }
}

export default function Register() {
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    registerUser(formData);
    e.target.reset();
  }

  return (
    <div className="register modal">
      <form onSubmit={handleSubmit} method="post">
        <div className="username-input">
          <label htmlFor="">Username</label>
          <input
            type="name"
            name="name"
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
