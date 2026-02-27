import React, {useContext, useEffect, useState} from "react";
import "./LoginPopup.css";
import {assets} from "../../assets/frontend_assets/assets";
import axios from "axios";

import {toast} from "react-toastify";
import {StoreContext} from "../../context/StoreContext";

const LoginPopup = ({setShowLogin}) => {
  const [currState, setCurrState] = useState("Login");

  const {setSignIn, signIn, URL, setUserName, userName} =
    useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changeHandler = async (event) => {
    return setData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const crossClickHandler = () => {
    setShowLogin(false);
  };

  const handleForgotPassword = async (event) => {
    if (event) event.preventDefault();
    if (!data.email) {
      toast.error("Please enter your email first");
      setCurrState("Forgot Password");
      return;
    }
    try {
      const response = await axios.post(`${URL}/api/user/forgot-password`, {
        email: data.email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setCurrState("Enter OTP");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error sending OTP. Check console for details.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${URL}/api/user/verify-otp`, {
        email: data.email,
        otp: otp,
      });
      if (response.data.success) {
        toast.success("OTP Verified!");
        setCurrState("Reset Password");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${URL}/api/user/reset-password`, {
        email: data.email,
        otp: otp,
        newPassword: newPassword,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setCurrState("Login");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error resetting password");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response =
      currState === "Sign Up"
        ? await axios.post(`${URL}/api/user/register`, data)
        : await axios.post(`${URL}/api/user/login`, data);

    if (response.data.success) {
      setData({
        name: "",
        email: "",
        password: "",
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #ff4c24, #ff6a3d)",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUserName(response.data.user.name);
      }

      setShowLogin(false);
      setSignIn(true);
    } else {
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: "linear-gradient(135deg, #574545, #675050)",
          color: "red",
          borderRadius: "14px",
          fontWeight: "600",
          fontFamily: "Outfit",
        },
      });
    }
  };

  return (
    <div className="Login-Popup">
      {currState === "Login" || currState === "Sign Up" ? (
        <form className="login-popup-container" onSubmit={handleSubmit}>
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={crossClickHandler}
            />
          </div>
          <div className="login-popup-input">
            {currState === "Sign Up" && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  value={data.name}
                  onChange={changeHandler}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                name="email"
                value={data.email}
                onChange={changeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="off"
                value={data.password}
                onChange={changeHandler}
              />
            </div>
          </div>
          {currState === "Login" && (
            <p
              className="forgot-password"
              onClick={() => setCurrState("Forgot Password")}>
              Forgot password?
            </p>
          )}
          <button type="submit">
            {currState === "Sign Up" ? "Create Account" : "Login"}
          </button>
          <div className="login-popup-condition">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the Terms of Use & Privacy Policy
            </label>
          </div>
          {currState === "Login" ? (
            <p>
              Don't have an account?
              <span onClick={() => setCurrState("Sign Up")}>Sign Up</span>
            </p>
          ) : (
            <p>
              Already have an account?
              <span onClick={() => setCurrState("Login")}>Login</span>
            </p>
          )}
        </form>
      ) : currState === "Forgot Password" ? (
        <form className="login-popup-container" onSubmit={handleForgotPassword}>
          <div className="login-popup-title">
            <h2>Recover Account</h2>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={crossClickHandler}
            />
          </div>
          <div className="login-popup-input">
            <p className="otp-note">
              Enter the email address associated with your account.
            </p>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={data.email}
                onChange={changeHandler}
              />
            </div>
          </div>
          <button type="submit">Send Reset Code</button>
          <p>
            Remember password?{" "}
            <span onClick={() => setCurrState("Login")}>Login</span>
          </p>
        </form>
      ) : currState === "Enter OTP" ? (
        <form className="login-popup-container" onSubmit={handleVerifyOtp}>
          <div className="login-popup-title">
            <h2>Verify OTP</h2>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={crossClickHandler}
            />
          </div>
          <div className="login-popup-input">
            <p className="otp-note">Enter 6-digit code sent to {data.email}</p>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
          <button type="submit">Verify OTP</button>
          <p>
            Did not receive code?{" "}
            <span onClick={handleForgotPassword}>Resend</span>
          </p>
        </form>
      ) : (
        <form className="login-popup-container" onSubmit={handleResetPassword}>
          <div className="login-popup-title">
            <h2>New Password</h2>
            <img
              src={assets.cross_icon}
              alt="close"
              onClick={crossClickHandler}
            />
          </div>
          <div className="login-popup-input">
            <div className="form-group">
              <label>Enter New Password</label>
              <input
                type="password"
                placeholder="New Password"
                required
                autoComplete="off"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
};

export default LoginPopup;
