import { useState } from "react";
import React from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    setLogin(formData);
  }

  function setLogin(formData) {
    const formJson = Object.fromEntries(formData.entries());
    setEmail(formJson.email);
    setPassword(formJson.password);
  }

  return (
    <div className="login-modal">
      <form onSubmit={handleSubmit} method="post">
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
        <button type="submit">Continue</button>
        <span>{email}</span>
        <span>{password}</span>
      </form>
    </div>
  );
}
