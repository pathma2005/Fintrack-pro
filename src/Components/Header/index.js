import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { FaLongArrowAltRight } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

function Header({ showLogout = true, showArrow = false }) {
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

    
      <div className="header-actions">
      
{showArrow && (
  <FaLongArrowAltRight
    className="arrow-icon"
    onClick={() => navigate("/dashboard2")}
  />
)}

     
        {user && showLogout && (
          <div className="user-logout" onClick={logoutfun}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="user-photo" />
            ) : (
              <div className="user-avatar">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
            )}
            <span className="logout-text">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;






