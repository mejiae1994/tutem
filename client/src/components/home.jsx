import { React } from "react";
import NavBar from "./navbar";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />
      <Dashboard />
    </div>
  );
}
