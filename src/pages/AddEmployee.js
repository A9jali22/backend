import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, updateDoc, getDoc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css"; // Import styles

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [leaves, setLeave] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); // Message for pop-up
  const [isError, setIsError] = useState(false); // Determines success/error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsSnapshot = await getDocs(collection(db, "teams"));
      setTeams(teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTeams();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Step 1: Check if Employee with this userID already exists
      const employeeRef = doc(db, "Employee", userID);
      const employeeSnap = await getDoc(employeeRef);

      if (employeeSnap.exists()) {
        setIsError(true);
        setPopupMessage("Employee with this User ID already exists!");
        return;
      }

      // ✅ Step 2: Check if Employee with this email already exists
      const emailQuery = query(collection(db, "Employee"), where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        setIsError(true);
        setPopupMessage("Employee with this Email already exists!");
        return;
      }

      // ✅ Step 3: Get selected team details
      const teamDoc = teams.find(team => team.id === selectedTeam);
      if (!teamDoc) throw new Error("Invalid team selection.");

      // ✅ Step 4: Add Employee Record with Required Email Fields
      await setDoc(employeeRef, {
        name,
        email,
        userID,
        leaves,
        role: "employee",
        teamID: selectedTeam,
        managerID: teamDoc.managerID,
        to: email,  //  Required for email sending
        message: {  //  Required for email sending
          subject: `Welcome to WorkTrace, ${name}!`,
          text: `Hi ${name},\n\nWelcome to the team! `,
          html: `<h1>Welcome, ${name}!</h1><p>We’re excited to have you on board.<br>Your credentials to register on our android app are:<br>Name : ${name}<br>User ID : ${userID}<br>Email : ${email}</p>`
        }
      });

      //  Step 5: Update team with new employee
      const teamRef = doc(db, "teams", selectedTeam);
      await updateDoc(teamRef, {
        employees: [...(teamDoc.employees || []), userID],
      });

      setIsError(false);
      setPopupMessage("Employee added successfully!");
    } catch (error) {
      setIsError(true);
      setPopupMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-container">
      {/* ✅ Success/Error Modal */}
      {popupMessage && (
        <div className="popup-modal">
          <div className={`popup-content ${isError ? "error" : "success"}`}>
            <p>{popupMessage}</p>
            <button onClick={() => { 
                setPopupMessage(""); 
                if (!isError) navigate("/dashboard"); // Only redirect if success
            }}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Form Card */}
      <div className="add-employee-card">
        <h2>Add Employee</h2>
        <form onSubmit={handleAddEmployee}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required />
          <input type="number" placeholder="No. of Leaves" value={leaves} onChange={(e) => setLeave(e.target.value)} required />

          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} required>
            <option value="">Select Team</option>
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
