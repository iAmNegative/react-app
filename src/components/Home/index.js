import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNav from "../CustomNav";
import { userData } from "../../helpers";
import "./Home.css"; // Import the custom stylesheet for Home component
import { API_BASE_URL } from "../../helpers";


const Home = () => {
  const { username } = userData();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <CustomNav />
      <div className="home">
        <h2 className="welcome-header">Welcome, {username || "Player"}</h2>
        {username && (
          <button className="messages-button" onClick={() => navigate("/messages")}>
            Start Chatting
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
