import React, {useState} from "react";
import "./Login.css";
import axios from "axios";
import {toast} from "react-toastify";

const Login = ({setToken, URL}) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({...data, [name]: value}));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${URL}/api/user/admin-login`, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("admin-token", response.data.token);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Admin Panel Login</h2>
        <form onSubmit={onLogin}>
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Admin Email"
            // autoComplete="off"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            autoComplete="off"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
