import React, { useState, useEffect } from 'react';
import CustomNav from "../CustomNav";
import { API_BASE_URL } from "../../helpers";
import { userData } from "../../helpers";
import axios from 'axios';
import './Posts.css';

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [userThumbs, setUserThumbs] = useState({});
  const [newSparkImage, setNewSparkImage] = useState(null);
  const [newSparkCaption, setNewSparkCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { jwt, id } = userData();

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setNewSparkImage(selectedImage);
  };

  const createSpark = async () => {
    if (!newSparkImage || !newSparkCaption) {
      alert('Please select an image and provide a caption.');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("files", newSparkImage);

      const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.data && uploadResponse.data[0].id) {
        const imageId = uploadResponse.data[0].id;

        try {
          const requestBody = {
            data: {
              image: imageId,
              caption: newSparkCaption,
              postCreatedBy: id,
            },
          };

          await axios.post(`${API_BASE_URL}/api/posts`, requestBody, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          setNewSparkImage(null);
          setNewSparkCaption('');
          setUploadingImage(false);
          fetchPosts();
        } catch (error) {
          console.error("Error igniting spark:", error);
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchUserThumbnails();
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts?populate=*&sort=id:desc`);
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserThumbnails = async () => {
    try {
      const users = await Promise.all(posts.map(async post => {
        const userId = post.attributes.postCreatedBy.data.id;
        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}?populate=*`);

        const userProfile = response.data.userProfile;
        const thumbnailUrl = userProfile && userProfile.length > 0
          ? userProfile[0].formats.thumbnail.url
          : null;

        return {
          id: userId,
          thumbnailUrl: thumbnailUrl,
        };
      }));

      const userThumbnails = {};
      users.forEach(user => {
        userThumbnails[user.id] = user.thumbnailUrl;
      });

      setUserThumbs(userThumbnails);
    } catch (error) {
      console.error('Error fetching user thumbnails:', error);
    }
  };

  return (
    <div>
      <CustomNav />
      <div className="posts-container">
        <div className="posts-header">
          <h1>Sparks</h1>
        </div>
        <div className="create-spark-button">
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            <span className="image-icon">📸</span>
          </label>
          <input
            type="text"
            placeholder="Enter caption..."
            value={newSparkCaption}
            onChange={(e) => setNewSparkCaption(e.target.value)}
            className="caption-input"
          />
          <button onClick={createSpark} disabled={uploadingImage} className="ignite-button">
            {uploadingImage ? "Creating..." : "Ignite"}
          </button>
        </div>
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="thumbnail-section">
              <img
                src={userThumbs[post.attributes.postCreatedBy.data.id] || "https://res.cloudinary.com/drzwoxrgj/image/upload/v1693246598/thumbnail_149071_6059a26d10.png"}
                alt="User Thumbnail"
                className="user-thumbnail"
              />
            </div>
            <div className="post-details">
              <div className="post-header">
                <span className="username">
                  {post.attributes.postCreatedBy.data.attributes.username}
                </span>
               
              </div>
              <img
                src={post.attributes.image.data[0].attributes.formats.medium.url || ""}
                alt="Post"
                className="post-image"
              />
              <div className="post-caption">{post.attributes.caption}</div>
              <div className="post-interactions">
                <span className="interaction-icon">
                  ⚡️ {post.attributes.likes}
                </span>
                <span className="interaction-icon">
                  💬 {post.attributes.comments}
                </span>
              </div>
              <div className='post-date'>
             
                  {new Date(post.attributes.createdAt).toLocaleString()}
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
