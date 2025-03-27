import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, where, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./RegisterAdmin.css"; // Import the CSS for styling

const RegisterAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(false); // State for success pop-up
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Check if email already exists in USERS collection
      const usersRef = collection(db, "USERS");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("An admin with this email already exists. Please use a different email.");
        setLoading(false);
        return;
      }

      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get Auth UID

      // Save user details in Firestore with auto-generated document ID
      await setDoc(doc(db, "USERS", userId), {
        name,
        email,
        role: "admin",
        createdAt: new Date(),
      });

      setSuccess(true); // Show success message
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after success
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-admin-container">
      <div className="register-admin-card">
        <h2>Register Admin</h2>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Error Message Popup */}
        {error && (
          <div className="popup-modal">
            <div className="popup-content error">
              <p>{error}</p>
              <button onClick={() => setError("")}>Close</button>
            </div>
          </div>
        )}

        {/* Success Message Popup */}
        {success && (
          <div className="popup-modal">
            <div className="popup-content success">
              <p>Registration successful!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterAdmin;
