import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import "./App.css";
import { createContext, useState } from "react";

export const LoginContext = createContext(null);

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("user"));

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route exact path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
