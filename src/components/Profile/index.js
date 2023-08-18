import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import "./Profile.css"; // Import your custom stylesheet for Profile component
import { API_BASE_URL } from "../../helpers";
import { Link } from "react-router-dom";

const { jwt } = userData();

const Profile = () => {
  const { id, username, email } = userData();
  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users?filters[$and][0][username][$eq]=${username}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }

      );
      if (response.data.length > 0) {
        setProfileData(response.data[0]);
        setEditedProfile({
          firstName: response.data[0].firstName || "",
          middleName: response.data[0].middleName || "",
          lastName: response.data[0].lastName || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile((prevEditedProfile) => ({
      ...prevEditedProfile,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${id}`, editedProfile,
      
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
      
      );
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <CustomNav />
      <div className="profile">
        <h2 className="profile-header">Profile Information</h2>
        <div className="profile-details">
          <p>
            <strong>Username:</strong> {profileData.username}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>First Name:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.firstName || "N/A"
            )}
          </p>
          <p>
            <strong>Middle Name:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="middleName"
                value={editedProfile.middleName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.middleName || "N/A"
            )}
          </p>
          <p>
            <strong>Last Name:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.lastName || "N/A"
            )}
          </p>
          <p>
            {editMode ? (
              <button className="profile-submit-btn" onClick={handleFormSubmit}>
                Save Changes
              </button>
            ) : (
              <Link className="profile-edit-btn" onClick={handleEditClick}>
                Edit Profile
              </Link>
              
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
