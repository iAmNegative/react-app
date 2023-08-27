import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import "./Profile.css"; // Import your custom stylesheet for Profile component
import { API_BASE_URL } from "../../helpers";
import { SPRING_BASE_URL } from "../../helpers";

import { Link } from "react-router-dom";

const { jwt } = userData();

const Profile = () => {
  const { id, username, email } = userData();
  const [profileImage, setProfileImage] = useState("");

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

      const requestBody = {
        username: username,
        jwt: jwt,
      
      };


      const data = await axios.post(`${SPRING_BASE_URL}/get/user/details`,requestBody

      );
      if (data) {
        setProfileData(data);
        setEditedProfile({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
        });
        setProfileImage(data.userProfileSmallUrl)
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
      <div className="profile-image">
        <img
          src={profileImage || "https://res.cloudinary.com/drzwoxrgj/image/upload/v1693074617/small_Prathamesh_satpute_90f97d88d7.jpg"}
          alt="Profile"
          className="profile-image"
        />
        
      </div>
      {profileImage && (
          <p>
            <Link className="profile-edit-btn" >
              Change Image
            </Link>
          </p>
        )}

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
            <strong>Middle Name (optional):</strong>{" "}
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
