import { React, useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";

export default function NavBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleModal(open) {
    setModalOpen(open);
  }

  async function handleLogout() {
    try {
      const response = await axiosRequest.post("users/logout");
      localStorage.setItem("user", null);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <nav>
        <div className="navbar-container">
          {user ? (
            <div className="user" onClick={() => handleModal(!modalOpen)}>
              <div className="profile-container">
                <img
                  src={user.userPreferences.profileImg}
                  alt="profile-image"
                />
                <span>{user?.username}</span>
              </div>
              {modalOpen && (
                <div className="options">
                  <Link to="/home">Home</Link>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link onClick={handleLogout}>Logout</Link>
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
