import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Container } from "reactstrap";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Registration from "./components/Registration";
import { Protector } from "./helpers";
import MessagesPage from "./components/MessagesPage";
import MessageViewPage from "./components/MessageViewPage";
import Profile from "./components/Profile";
import MyImage from "./components/MyImage";
import Posts from "./components/Posts";
import VideoChat from "./components/VideoChat";

function App() {
  const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
  const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes in milliseconds

  const [loggedIn, setLoggedIn] = useState(false);

  const updateLoginTime = () => {
    localStorage.setItem("loginTime", Date.now().toString());
  };

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const user = localStorage.getItem("user");


    const logoutUser = () => {
      localStorage.removeItem("loginTime");
      localStorage.removeItem("user");
      window.location.href = "/#/login"; // Redirect to the login page after expiration
    };

    const checkTokenValidity = () => {
      const currentTime = Date.now();

      if ( user && loginTime) {
        if (currentTime - parseInt(loginTime) > TOKEN_EXPIRATION_TIME) {
          // Token expired, clear token and login time
          logoutUser();
        } else {
          // Token still valid, refresh the inactivity timer
          updateLoginTime();
          setLoggedIn(true);
        }
      } else {
        // No token or login time found
        localStorage.removeItem("loginTime");
        logoutUser();
      }
    };

    // Initial check
    checkTokenValidity();
  }, []);

  useEffect(() => {
    // Set up inactivity timer
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Logout user due to inactivity
        logoutUser();
      }, INACTIVITY_TIMEOUT);
    };

    const logoutUser = () => {
      localStorage.removeItem("loginTime");
      localStorage.removeItem("user");
      window.location.href = "/#/login"; // Redirect to the login page after expiration
    };

    // Event listeners to reset inactivity timer on activity
    const handleActivity = () => {
      updateLoginTime();
      resetInactivityTimer();
    };

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
    };
  }, []);

  return (
    <Container>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Protector Component={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/messages" element={<Protector Component={MessagesPage} />} />
          <Route path="/view-messages/:id" element={<Protector Component={MessageViewPage} />} />
          <Route path="/profile" element={<Protector Component={Profile} />} />
          <Route path="/images" element={<Protector Component={MyImage} />} />
          <Route path="/posts" element={<Protector Component={Posts} />} />
          <Route path="/video-chat/:id" element={<Protector Component={VideoChat} />} />
        </Routes>
      </HashRouter>
    </Container>
  );
}

export default App;
