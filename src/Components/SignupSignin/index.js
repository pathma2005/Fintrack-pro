import React, { useState, useEffect } from "react";
import { auth, provider, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style.css";

function SignupSigninComponents() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
        photoURL: "",
        createdAt: serverTimestamp(),
      });

      toast.success("User created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.code.replace("auth/", "").replaceAll("-", " ")
      );
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });

      toast.success("Signed up with Google");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.code.replace("auth/", "").replaceAll("-", " ")
      );
    }

    setLoading(false);
  };

  return (
    <div className="signupwrapper">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="signup-title">Sign up to FinTrack</h2>

      <form className="signup-form" onSubmit={handleSignup}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter confirm password"
          />
        </div>

        <button className="signup-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <button
        className="google-btn"
        onClick={handleGoogleSignup}
        disabled={loading}
      >
        <img
          src="/assets/google-logo.png"
          alt="Google"
          className="google-logo"
        />
        Sign up with Google
      </button>

      <p className="already-account">
        Already have an account?{" "}
        <span
          className="login-link"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default SignupSigninComponents;


