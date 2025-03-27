import React, { useState } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AddManager.css"; // Import styles

const AddManager = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamID, setTeamID] = useState("");
  const [leaves, setLeave] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleAddManager = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Step 1: Check if Manager already exists with same User ID
      const managerRef = doc(db, "Employee", userID);
      const managerSnap = await getDoc(managerRef);

      if (managerSnap.exists()) {
        setIsError(true);
        setPopupMessage("A Manager with this User ID already exists!");
        return;
      }

      // ✅ Step 2: Check if Email is already registered
      const emailQuery = query(collection(db, "Employee"), where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setIsError(true);
        setPopupMessage("A Manager with this Email already exists!");
        return;
      }

      // ✅ Step 3: Add Manager to `Employee` collection
      await setDoc(managerRef, {
        name,
        email,
        userID,
        leaves,
        role: "manager",
        teamID,
      });

      // ✅ Step 4: Add Team to `teams` collection
      await setDoc(doc(db, "teams", teamID), {
        name: teamName,
        managerID: userID,
        employees: [],
      });

      setIsError(false);
      setPopupMessage("Manager and Team added successfully!");
    } catch (error) {
      setIsError(true);
      setPopupMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-manager-container">
      {/* ✅ Pop-up Message */}
      {popupMessage && (
        <div className="popup-modal">
          <div className={`popup-content ${isError ? "error" : "success"}`}>
            <p>{popupMessage}</p>
            <button onClick={() => { 
                setPopupMessage(""); 
                if (!isError) navigate("/dashboard");
            }}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Form Card */}
      <div className="add-manager-card">
        <h2>Add Manager & Team</h2>
        <form onSubmit={handleAddManager}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required />
          <input type="text" placeholder="No. of Leaves" value={leaves} onChange={(e) => setLeave(e.target.value)} required />
          <input type="text" placeholder="Team ID" value={teamID} onChange={(e) => setTeamID(e.target.value)} required />
          <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Manager & Team"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddManager;
