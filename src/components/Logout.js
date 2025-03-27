import React from "react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
