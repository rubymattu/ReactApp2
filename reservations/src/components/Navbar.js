import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
 
const Navbar = () => {
    const location = useLocation();

  // Hide links on login or register page
  const hideLinks = location.pathname === "/login" || location.pathname === "/register";
  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Raveena's Reservations</NavLink>
        {!hideLinks && (
          <>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fs-5">
            <li className="nav-item me-5">
              <NavLink 
                className={"nav-link" + (location.pathname === "/" ? " active" : "")} 
                to="/"
              >Home</NavLink>
            </li>
            <li className="nav-item me-5">
              <NavLink className={"nav-link" + (location.pathname === "/create-reservation" ? " active" : "")} 
                to="/create-reservation">Add Reservation 
              </NavLink>            
            </li>
          </ul>
        </div>
        </>
        )}
      </div>
    </nav>
  );
};
 
export default Navbar;