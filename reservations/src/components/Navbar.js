import React from 'react';
import { Link, useLocation } from 'react-router-dom';
 
const Navbar = () => {
  const location = useLocation();
  return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Raveena's Reservations</Link>
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
              <Link 
                className={"nav-link" + (location.pathname === "/" ? " active" : "")} 
                to="/"
              >Home</Link>
            </li>
            <li className="nav-item me-5">
              <Link className={"nav-link" + (location.pathname === "/create-reservation" ? " active" : "")} 
                to="/create-reservation">Add Reservation 
              </Link>            
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
 
export default Navbar;