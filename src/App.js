import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuBar from "./components/layout/menubar";
import ExcelUploadAndSubmit from "./components/ExcelUploadAndSubmit";
import Login from "./components/login/Login";
import SignupScreen from "./components/Signup/Signup"
import ExpenseDashboard from "./components/home";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const storedSignedInStatus = localStorage.getItem("isSignedIn");
    if (storedSignedInStatus) {
      setIsSignedIn(JSON.parse(storedSignedInStatus));
    }
  }, []);

  const signin = () => {
    setIsSignedIn(true);
    localStorage.setItem("isSignedIn", true);
  };

  const signout = () => {
    setIsSignedIn(false);
    localStorage.removeItem("isSignedIn");
  };

  const signup = () => {
    setIsSignedIn(true);
    localStorage.setItem("isSignedIn", true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <MenuBar isSignedIn={isSignedIn} signout={signout} />
        <div className="content-container">
          <Routes>
          {isSignedIn ? (
              <React.Fragment>
                <Route path="/ExcelUploadAndSubmit" element={<ExcelUploadAndSubmit />} />
                <Route path="/home" element={<ExpenseDashboard />} />
              </React.Fragment>
              )
              : (
              <React.Fragment>
                <Route path="/" element={<Login onLogin={signin} onSignup={signup} />} />
                <Route path="/signup" element={<SignupScreen onSignup={signup} />} />
              </React.Fragment>
            )}
          </Routes>
        </div>
      </BrowserRouter>
         
    </div>
  );
}
