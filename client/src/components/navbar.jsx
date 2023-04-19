import { React, useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { axiosRequest } from "../utils/axiosRequest";
import homeIcon from "../assets/home.png";
import dashboardIcon from "../assets/dashboard.png";
import logoutIcon from "../assets/log-out.png";

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
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

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
                  <Link className="options-row" to="/home">
                    <img src={homeIcon} alt="" />
                    <span>Home</span>
                  </Link>
                  <Link className="options-row" to="/dashboard">
                    <img src={dashboardIcon} alt="" />
                    <span>Dashboard</span>
                  </Link>
                  <Link className="options-row" onClick={handleLogout}>
                    <img src={logoutIcon} alt="" />
                    <span>Logout</span>
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
