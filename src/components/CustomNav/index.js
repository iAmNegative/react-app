import React, { useState, useEffect } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { userData } from "../../helpers";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../helpers";
import "./CustomNav.css"; // Import your custom styles


const CustomNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { username } = userData();
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
    setLastActivity(Date.now());
  };
  const handleLogout = () => {
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("userData");
    navigate("/logout"); // Navigate to the LogoutPage
  };

  

  useEffect(() => {
    const TOKEN_EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds

    const handleTokenExpiration = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > TOKEN_EXPIRATION_TIME) {
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("userData");
        navigate("/login"); // Navigate to the login page or show a notification
      }
    };

    const tokenExpirationInterval = setInterval(handleTokenExpiration, 10000);
    return () => clearInterval(tokenExpirationInterval);
  }, [lastActivity, navigate]);

  return (
    <div className="custom-nav">
      <Navbar expand="md" className="gaming-navbar">
        <NavbarBrand tag={Link} to="/" className="mr-auto gaming-brand">
          Promithous
        </NavbarBrand>
        <NavbarToggler onClick={toggle} className={`navbar-toggler-icon ${isOpen ? 'open' : ''}`} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {username === null ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/registration" className="gaming-link">
                    Register
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login" className="gaming-link">
                    Sign In
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/profile" className="gaming-link">
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/messages" className="gaming-link">
                    Friends
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/logout" className="gaming-link"  >
                    Log Out 
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/Images" className="gaming-link">
                    Images
                  </NavLink>
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
