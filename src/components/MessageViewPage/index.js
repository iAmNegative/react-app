import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import { useParams } from "react-router-dom";
import './chatInterface.css'; // Import the chat interface styles
import { API_BASE_URL } from "../../helpers";
import { SPRING_BASE_URL } from "../../helpers";

const { jwt } = userData();

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
      const response = await getUsersMessage(loggedInUserId, receiverUserId, jwt);
      console.log("jsonResponse:", response); // Add this line
      setMessages(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  


  const getUsersMessage = async (user1, user2, jwt) => {
    try {
      const response = await axios.get("http://localhost:1337/api/messages?populate=*", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
  
      if (!response.data || !response.data.data) {
        console.error("Invalid response format");
        return [];
      }
  
      const jsonResponse = response.data;
      const allMessage = mapJsonToMessages(jsonResponse);
     

      const results = [];
  
      for (const m of allMessage) {
      
        if (
          (m.receiverUser.userId == loggedInUserId && m.senderUser.userId == receiverUserId) ||
          (m.receiverUser.userId == receiverUserId && m.senderUser.userId == loggedInUserId)
        ) {
          results.push(m);
        }
      }
  
      results.sort((c1, c2) => c1.messageId - c2.messageId);
      console.error("Error each messages 72:",results);
      return results;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };
  
  




  function mapJsonToMessages(jsonResponse) {
    const messages = [];

    for (const messageNode of jsonResponse.data) {
        const messageId = messageNode.id;
        const userMessage = messageNode.attributes.userMessage;
        const createdAt = new Date(messageNode.attributes.createdAt);
        const updatedAt = new Date(messageNode.attributes.updatedAt);
        const senderUser = mapUserFromJson(messageNode.attributes.senderUser.data);
        const receiverUser = mapUserFromJson(messageNode.attributes.receiverUser.data);

        const message = {
            messageId,
            userMessage,
            createdAt,
            updatedAt,                     
            senderUser,
            receiverUser
        };
        console.error("Error each messages:", message.receiverUser.userName);

        messages.push(message);

    }

    return messages;
}



  function mapUserFromJson(userNode) {
    const userId = userNode.id;
    const userName = userNode.attributes.username;
    const firstName = userNode.attributes.firstName;
    const lastName = userNode.attributes.lastName;
    const email = userNode.attributes.email;

    return {
        userId,
        userName,
        firstName,
        lastName,
        email
    };
}

  const fetchOtherUserName = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${receiverUserId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setOtherUserName(response.data.username);
    } catch (error) {
      console.error("Error fetching other user's username:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const senderUserId = userData().id;
      const requestBody = {
        data: {
          senderUser: { id: senderUserId },
          receiverUser: { id: receiverUserId },
          userMessage: newMessage,
        },
      };

      await axios.post(`${API_BASE_URL}/api/messages`, requestBody, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

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
                  className={message.senderUser?.userId === loggedInUserId ? "sent" : "received"}
                >
                  <div className="message">
                    <p>{message.userMessage}</p>
                    <p className="message-timestamp">
                      {message.senderUser?.userId === loggedInUserId
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
