import React, { useState, useEffect } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { userData } from "../../helpers";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../helpers";


const CustomNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { username } = userData();
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds
    
    const handleTokenExpiration = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > TOKEN_EXPIRATION_TIME) {
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("userData");
        navigate("/login"); // Navigate to login page or show a notification
      }
    };

    const tokenExpirationInterval = setInterval(handleTokenExpiration, 10000);
    return () => clearInterval(tokenExpirationInterval);
  }, [lastActivity, navigate]);

  return (
    <div className="custom-nav">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/" className="mr-auto">
          Chater Patter
        </NavbarBrand>
        <NavbarToggler onClick={toggle} className="mr-2" />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            {username === null && (
              <>
                <NavItem>
                  <NavLink href="/registration">Registration</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/login">Login</NavLink>
                </NavItem>
              </>
            )}
            {username !== null && (
              <>
                <NavItem>
                  <NavLink href="/profile">Profile</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/logout">Logout</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/messages">Friends</NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNav;
