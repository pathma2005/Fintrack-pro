import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { getGravatarUrl } from "../../utils";
import "./style.css";

function Header({ showLogout = true, showArrow = false, showLeftArrow = false }) {
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

      {showLeftArrow && (
        <FaArrowLeftLong
          className="left-arrow-icon"
          onClick={() => navigate("/dashboard")}
        />
      )}

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
            <img src={user.photoURL || getGravatarUrl(user.email) || "/assets/user.svg"} alt="User" className="user-photo" />
            <span className="logout-text">Logout</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;





