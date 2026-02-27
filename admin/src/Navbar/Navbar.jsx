import React from "react";
import "./Navbar.css";
import {assets} from "../assets/admin_assets/assets.js";

const Navbar = ({setToken}) => {
  const logout = () => {
    setToken("");
    localStorage.removeItem("admin-token");
  };

  return (
    <div className="Navbar">
      <img className="logo" src={assets.logo} alt="" />
      <div className="navbar-right">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
        <img className="profile" src={assets.profile_image} alt="" />
      </div>
    </div>
  );
};

export default Navbar;
