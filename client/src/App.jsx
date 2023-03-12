import { useState } from "react";
import NavBar from "./components/navbar";
import Login from "./components/login";
import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Login></Login>
    </div>
  );
}

export default App;
