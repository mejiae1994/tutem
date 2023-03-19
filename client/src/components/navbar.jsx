import { React, useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import myImage from "../assets/profile2.jpg";

export default function NavBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  function handleModal(open) {
    setModalOpen(open);
  }

  console.log(modalOpen);
  return (
    <>
      <nav>
        <div className="navbar-container">
          {user ? (
            <div className="user" onClick={() => handleModal(!modalOpen)}>
              <div className="profile-container">
                <img src={myImage} alt="profile-image" />
                <span>{user?.username}</span>
              </div>
              {modalOpen && (
                <div className="options">
                  <Link to="/home">Home</Link>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link
                    onClick={() => {
                      setUser(null);
                      localStorage.setItem("user", null);
                    }}
                    to="/"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
