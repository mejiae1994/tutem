import { React, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);

  return (
    <nav>
      <ul className="navbar">
        <li>
          {user == null ? (
            <Link to="/login">Login</Link>
          ) : (
            <Link
              onClick={() => {
                setUser(null);
                localStorage.clear();
              }}
              to="/"
            >
              Logout
            </Link>
          )}
        </li>
        <li>{user == null ? <Link to="/register">Register</Link> : null}</li>
      </ul>
    </nav>
  );
}
