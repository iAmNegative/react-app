import React, { useEffect } from "react";
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

function App() {
  // Token expiration handling
  const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 2 minutes in milliseconds

  const handleTokenExpiration = () => {
    const currentTime = Date.now();
    const lastActivityTime = parseInt(localStorage.getItem("lastActivity")) || 0;

    if (currentTime - lastActivityTime > TOKEN_EXPIRATION_TIME) {
      // Clear user data and log them out
      localStorage.removeItem("lastActivity");
      localStorage.removeItem("userData");
      window.location.href = "/#/login"; // Redirect to the login page after expiration
    } else {
      // Update the last activity timestamp
      localStorage.setItem("lastActivity", currentTime);
    }
  };

  useEffect(() => {
    const tokenExpirationInterval = setInterval(handleTokenExpiration, TOKEN_EXPIRATION_TIME);
    return () => clearInterval(tokenExpirationInterval);
  }, []);

  return (
    <Container>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Protector Component={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/view-messages/:id" element={<MessageViewPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/images" element={<MyImage />} />
        </Routes>
      </HashRouter>
    </Container>
  );
}

export default App;
