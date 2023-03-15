import { React, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../App";

export default function NavBar() {
  const { loggedIn, setLoggedIn } = useContext(LoginContext);

  return (
    <nav>
      <ul className="navbar">
        <li>
          {!loggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
            <Link
              onClick={() => {
                setLoggedIn(false);
                localStorage.clear();
              }}
              to="/"
            >
              Logout
            </Link>
          )}
        </li>
        <li>{!loggedIn ? <Link to="/register">Register</Link> : null}</li>
      </ul>
    </nav>
  );
}
