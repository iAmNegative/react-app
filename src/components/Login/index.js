import React, { useState } from "react";
import { Col, Row, Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { storeUser } from "../../helpers";
import "./Login.css"; // Import the custom stylesheet for Login component
import { API_BASE_URL } from "../../helpers";

const initialUser = { password: "", identifier: "" };
const Login = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {

    const url = `${API_BASE_URL}/api/auth/local`; // Use the constant here

    try {
      if (user.identifier && user.password) {
        const { data } = await axios.post(url, user);
        if (data.jwt) {
          storeUser(data);
          toast.success("Logged in successfully!", {
            hideProgressBar: true,
          });
          setUser(initialUser);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      });
    }
  };

  return (
    <Row className="login">
      <Col >
        <div>
          <h2>Login:</h2>
          <FormGroup>
            <input
              type="email"
              name="identifier"
              value={user.identifier}
              onChange={handleChange}
              placeholder="Enter your username or email"
            />
          </FormGroup>

          <FormGroup>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormGroup>

          <Button color="primary" onClick={handleLogin}>
            Login
          </Button>
          <h6>
            Click <Link to="/registration">Here</Link> to sign up
          </h6>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
