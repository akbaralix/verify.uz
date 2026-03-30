import React from "react";
import "./login.css";

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getStoredUsername, setStoredUsername } from "../../lib/storage";

function Login() {
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const storedUsername = getStoredUsername();

  if (storedUsername) {
    return <Navigate replace to="/sorovnoma" />;
  }

  const handleLogin = () => {
    const trimmedName = username.trim();

    if (trimmedName.length < 3) {
      alert("Ismingiz kamida 3 ta harfdan iborat bo'lishi kerak.");
      return;
    }

    setStoredUsername(trimmedName);
    navigate("/sorovnoma");
  };

  return (
    <div className="login-container">
      <img src="/verifyuzlogo.png" alt="Verify.uz logo" />
      <p>
        Verify.uz platformasiga kiring va iste&apos;molchi huquqlarini buzish
        holatlari bo&apos;yicha so&apos;rovnomani to&apos;ldiring.
      </p>

      <div className="login-form">
        <div className="login-input">
          <input
            type="text"
            placeholder=" "
            name="loginput"
            id="loginput"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <label htmlFor="loginput">Ismingiz</label>
        </div>
        <button onClick={handleLogin}>So&apos;rovnomani boshlash</button>
      </div>
    </div>
  );
}

export default Login;
