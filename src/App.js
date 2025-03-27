import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import RootPage from "./pages/RootPage";
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEmployee from "./pages/AddEmployee";
import AddManager from "./pages/AddManager";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  

  return (
    <Router>
      <Routes>
        {/* Always land on RootPage */}
        <Route path="/" element={<RootPage />} />
        
        {/* Redirect logged-in users to Dashboard */}
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={ <RegisterAdmin />} />
        
        {/* Dashboard is protected */}
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/add-employee" element={<ProtectedRoute user={user}><AddEmployee /></ProtectedRoute>} />
        <Route path="/add-manager" element={<ProtectedRoute user={user}><AddManager /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;


