import { React } from "react";
import NavBar from "./navbar";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <Dashboard />
      {/* {location != null ? <h2>Hello {location.state.user}</h2> : "error"} */}
    </div>
  );
}
