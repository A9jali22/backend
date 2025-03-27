import React from "react";
import { Link } from "react-router-dom";
import "./RootPage.css"; // Import updated styles

const RootPage = () => {
  return (
    <div className="root-container">
      <div className="content-box">
        <h1 className="main-heading">Welcome to the Admin Portal</h1>
        <p className="subtext">Securely manage your organization with ease.</p>
        <div className="buttons">
          <Link to="/login">
            <button className="btn login-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn register-btn">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
