import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import styles
import AddEmployee from "./AddEmployee";
import AddManager from "./AddManager";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Redirect to RootPage after logout
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        
        <button className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>
          Home
        </button>
        <button className={activeTab === "add-employee" ? "active" : ""} onClick={() => setActiveTab("add-employee")}>
          Add Employee
        </button>
        <button className={activeTab === "add-manager" ? "active" : ""} onClick={() => setActiveTab("add-manager")}>
          Add Manager
        </button>

        {/* Logout Button Now Below Other Options */}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeTab === "home" && (
          <div className="dashboard-welcome">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Select an option from the sidebar to get started.</p>

            {/* Flashcards */}
            <div className="flashcard-container">
              <div className="flashcard flashcard-blue">
                <h3>Add a New Manager</h3>
                <p>Create a new team and assign a manager to it. Structure teams effectively within the company.</p>
              </div>

              <div className="flashcard flashcard-green">
                <h3>Add a New Employee</h3>
                <p>Register a new employee and assign them to their respective managers and teams.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "add-employee" && <AddEmployee />}
        {activeTab === "add-manager" && <AddManager />}
      </div>
    </div>
  );
};

export default Dashboard;
