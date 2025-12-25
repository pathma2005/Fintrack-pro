import React from "react";
import "./style.css"
function Header() {
  function logout(){
    alert("logout")
  }
  return (
    <div className="navbar">
      <p className="logo">
       FinTrack
      </p>
      <p className="logo link" onclick={logout}>Logout</p>
    </div>
  );
}

export default Header;
