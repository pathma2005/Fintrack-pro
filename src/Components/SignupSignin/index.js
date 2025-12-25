import React, { useState } from "react";
import { auth, provider, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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

    if (password !== confirmPassword) {
      alert("Passwords do not match");
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
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.code.replace("auth/", "").replaceAll("-", " "));
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
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.code.replace("auth/", "").replaceAll("-", " "));
    }
    setLoading(false);
  };

  return (
    <div className="signupwrapper">
      <h2 className="signup-title">Sign Up to FinTrack</h2>

      <form className="signup-form" onSubmit={handleSignup}>
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
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
    </div>
  );
}

export default SignupSigninComponents;

