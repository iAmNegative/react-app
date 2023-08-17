// MessageViewPage.js
import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import { useParams } from "react-router-dom";
import './chatInterface.css'; // Import the chat interface styles
import { API_BASE_URL } from "../../helpers";
const {jwt} =  userData();


const MessageViewPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const loggedInUserId = userData().id; // Get the logged-in user's ID
  const { id: receiverUserId } = useParams();
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchOtherUserName();
  }, []);

  const fetchMessages = async () => {

    

    try {
      
        const requestBody = {
            jwt: jwt

          
          };

      const response = await axios.post(`/productapi/get/messages//${loggedInUserId}/${receiverUserId}`, requestBody );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchOtherUserName = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${receiverUserId}`,
      {
        headers: { Authorization: `Bearer ${jwt}`},
      }
      );
      setOtherUserName(response.data.username);
    } catch (error) {
      console.error("Error fetching other user's username:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const senderUserId = userData().id; // Get the logged-in user's ID
      const requestBody = {
        data: {
          senderUser: { id: senderUserId },
          receiverUser: { id: receiverUserId },
          userMessage: newMessage,
        },
      };

      await axios.post("http://localhost:1337/api/messages", requestBody, 
      
      {
        headers: { Authorization: `Bearer ${jwt}`},
      }

      
      );

      setSuccessMessage(`The message "${newMessage}" is successfully sent to ${otherUserName}`);
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  return (
    <div>
      <CustomNav />
      <div className="message-view-page">
        <h2>Message View</h2>
        <h3>Conversation with {otherUserName}</h3>
        <div className="message-list">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            <ul>
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={message.senderUser.userId === loggedInUserId ? "sent" : "received"}
                >
                  <div className="message">
                    <p>{message.userMessage}</p>
                    <p className="message-timestamp">
                      {message.senderUser.userId === loggedInUserId
                        ? `Sent at: ${new Date(message.createdAt).toLocaleString()}`
                        : `Received at: ${new Date(message.createdAt).toLocaleString()}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default MessageViewPage;
