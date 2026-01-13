import React, { useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../Components/SignupSignin/style.css";
import img2 from "../assets/img2.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
    }
    setLoading(false);
  };
  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed");
    }
    setLoading(false);
  };
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Unable to send reset email");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        background: `linear-gradient(
          rgba(105,104,117,0.85),
          rgba(27,56,198,0.88)
        ), url(${img2})`,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="signupwrapper">
        <h2 className="signup-title">Login to FinTrack</h2>

        <form className="signup-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button className="signup-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
            <img
          src="/assets/google-logo.png"
          alt="Google"
          className="google-logo"
        />
          Login with Google
        </button>
        <p className="forgot-password" onClick={handleForgotPassword}>
          Forgot password?
        </p>
        <p className="spam-note">
          Note: Password reset emails may go to your spam folder.
        </p>
      </div>
    </div>
  );
}

export default Login;


