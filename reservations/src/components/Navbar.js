import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

 
const Navbar = () => {
    const location = useLocation();
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

  // Hide links on login or register page
  const hideLinks = location.pathname === "/login" || location.pathname === "/register";
  const handleLogout = () => {
    setUser(null); // clear user
    navigate("/login");
  };
  
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
              {/* Username dropdown */}
                {user && (
                  <li className="nav-item dropdown">
                    <span
                      className="nav-link dropdown-toggle username-link"
                      id="userDropdown"
                      role="button"
                    >
                      Hi {user.userName}!
                    </span>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                )}
          </ul>
        </div>
        </>
        )}
      </div>
      {/* Extra CSS for hover effect */}
      <style>
        {`
          .nav-item.dropdown:hover .dropdown-menu {
            display: block;
            margin-top: 0; /* aligns dropdown */
          }
          .dropdown-toggle::after {
            display: none; /* hide caret if you don’t want it */
          }
          .username-link {
            font-weight: 600;
            color: #86c8ffff !important; /* Bootstrap warning color (gold) */
            cursor: pointer;
          }
        `}
      </style>
    </nav>
  );
};
 
export default Navbar;