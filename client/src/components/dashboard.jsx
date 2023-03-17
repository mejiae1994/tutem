import React, { useContext } from "react";
import UserProfile from "./userProfile";
import { UserContext } from "../context/UserProvider";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {user != null ? (
        <UserProfile userData={user} />
      ) : (
        <span>no user logged in</span>
      )}
    </div>
  );
}
