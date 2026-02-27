import React, {useState, useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import {Route, Routes, Navigate} from "react-router-dom";
import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Login from "./pages/Login/Login.jsx";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("admin-token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  if (!token) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login setToken={setToken} URL={URL} />
      </>
    );
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Navbar setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/list" />} />
          <Route path="/add" element={<Add apiURL={URL} token={token} />} />
          <Route path="/list" element={<List URL={URL} token={token} />} />
          <Route path="/orders" element={<Orders URL={URL} token={token} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
