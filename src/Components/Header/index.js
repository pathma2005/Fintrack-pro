import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
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

  const userInitial = user?.email
    ? user.email.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="navbar">
      {showLeftArrow && (
        <FaArrowLeftLong
          className="left-arrow-icon"
          onClick={() => navigate("/dashboard")}
        />
      )}

      <div className="nav-center">
        <p className="logo">FinTrack</p>
      </div>

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
              <img
                src={user.photoURL}
                alt="User"
                className="user-photo"
              />
            ) : (
              <div className="user-avatar">
                {userInitial}
              </div>
            )}
            <span className="logout-text">Logout</span>
          </div>
        )}
      </div>


      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Header;






