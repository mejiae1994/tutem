import React from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();

  console.log(location);
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {location != null ? <h2>Hello {location.state.user}</h2> : "error"}
    </div>
  );
}
