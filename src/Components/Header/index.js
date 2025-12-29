import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const logoutfun = async () => {
    try {
      await signOut(auth);

      toast.success("Logout Successfully");

      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return <div className="navbar">Checking user...</div>;
  }

  return (
    <div className="navbar">
      <ToastContainer position="top-right" autoClose={3000} /> 
      <p className="logo">FinTrack</p>
      {user && (
        <p className="logo link" onClick={logoutfun}>
          Logout
        </p>
      )}
    </div>
  );
}

export default Header;

