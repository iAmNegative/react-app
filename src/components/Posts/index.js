import React, { useState, useEffect } from 'react';
import CustomNav from "../CustomNav";
import { API_BASE_URL } from "../../helpers";


import axios from 'axios';
import './Posts.css';

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [userThumbs, setUserThumbs] = useState({});

  useEffect(() => {
    // Fetch posts from the API
    axios.get(`${API_BASE_URL}/api/posts?populate=*`)
      .then(response => {
        setPosts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch user thumbnail images
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

    if (posts.length > 0) {
      fetchUserThumbnails();
    }
  }, [posts]);

  return (
    <div>
         <CustomNav />
    <div className="posts-container">
      <div className="posts-header">
        <h1>Sparks</h1>
      </div>
      <div className="create-spark-button">
        <button>Create Spark</button>
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
              <span className="post-date">
                {new Date(post.attributes.createdAt).toLocaleString()}
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
          </div>
        </div>
      ))}
    </div>
    </div>
 );
};

export default Posts;
