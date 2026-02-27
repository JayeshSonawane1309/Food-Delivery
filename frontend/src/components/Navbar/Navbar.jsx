import React, {useContext, useState} from "react";
import "./Navbar.css";
import {assets} from "../../assets/frontend_assets/assets";
import {Link, useLocation} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {getTotalCartAmount, signIn, setSignIn, URL, userName, setUserName} =
    useContext(StoreContext);

  const signClickHandler = () => {
    setShowLogin(true);
  };

  const loginOutHandler = async () => {
    try {
      await axios.post(`${URL}/api/user/logout`);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");

      setUserName(null);
      setSignIn(false);

      toast.success("Logged out successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const handleMenuClick = (menuItem, targetId) => {
    setMenu(menuItem);
    if (location.pathname !== "/") {
      navigate("/");
      // Using a longer timeout to ensure Home page components are mounted
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({behavior: "smooth"});
        }
      }, 500);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({behavior: "smooth"});
      }
    }
  };

  return (
    <div className="Navbar">
      {/* Logo */}
      <Link to="/" onClick={() => setMenu("home")}>
        <img src={assets.logo} alt="app_logo" className="logo" />
      </Link>

      {/* Menu */}
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}>
            Home
          </Link>
        </li>

        <li>
          <span
            onClick={() => handleMenuClick("menu", "ExploreMenu")}
            className={menu === "menu" ? "active" : ""}
            style={{cursor: "pointer"}}>
            Menu
          </span>
        </li>

        <li>
          <span
            onClick={() => handleMenuClick("mobile-app", "App-Downloads")}
            className={menu === "mobile-app" ? "active" : ""}
            style={{cursor: "pointer"}}>
            Mobile App
          </span>
        </li>

        <li>
          <span
            onClick={() => handleMenuClick("contact-us", "Footer")}
            className={menu === "contact-us" ? "active" : ""}
            style={{cursor: "pointer"}}>
            Contact Us
          </span>
        </li>
      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="search_icon" />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="basket_icon" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {!signIn ? (
          <button onClick={signClickHandler}>Sign-In</button>
        ) : (
          <div className="navbar-user">
            <div className="user-profile" onClick={() => setOpen(!open)}>
              <div className="avatar">{userName?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{userName}</span>
              <span className={`dropdown-icon ${open ? "rotate" : ""}`}>▼</span>
            </div>

            {open && (
              <div className="user-dropdown">
                <p
                  onClick={() => {
                    navigate("/myorders");
                  }}>
                  My Orders
                </p>
                <p onClick={loginOutHandler}>Logout</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
