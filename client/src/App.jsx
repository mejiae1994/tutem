import { Router, Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import "./App.css";
//import axios and try to connect to express server

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
