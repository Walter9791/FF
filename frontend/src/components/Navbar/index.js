import React, {useContext, useState} from "react";
import AuthContext from "../../context/authContext";
import { Link } from "react-router-dom";  

const Navbar = ({}) => {
    const { user } = useContext(AuthContext);
    const { logoutUser } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);

    // `isLoggedIn` is true if `user` is not null
    const isLoggedIn = user !== null;
    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    };

    return (
      <nav className="navigation">
        <h2>DOPP</h2>
        <div className="nav-items left">
          <a href="/">Home</a>
          <a href="/about">About</a>
          {isLoggedIn && (
            <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <button className="dropbtn">Leagues</button>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link to="/my-leagues">My Leagues</Link>
                  <Link to="/create-league">Create League</Link>
                  <Link to="/join-league">Join League</Link>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="nav-items right">
          {isLoggedIn ? (
            // Links to show when the user is logged in
            <>
              <a href="/profile">Profile</a>
              <Link to="/" onClick={(e) => {
                e.preventDefault();
                logoutUser();
              }}>Logout</Link>
            </>
          ) : (
            // Links to show when the user is not logged in
            <>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </>
          )}
        </div>
      </nav>
    );
  };


export default Navbar;
