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
        <h1>DOPP</h1>
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


//     <nav className="navigation"> 
//       <h1>DOPP</h1>
//       <div className="nav-items left">
//         <a href="/">Home</a>
//         <a href="/about">About</a>
//         <a href="/leagues">Leagues</a>
//       </div>
//       <div className="nav-items right">
//         <a href="/login">Login</a>
//         <a href="/signup">Sign Up</a>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






// import { ReactNavbar } from "overlay-navbar";

// const options = {
//   burgerColorHover: "#eb4034",
//   logoWidth: "1rem",
//   navColor1: "white",
//   logoHoverSize: "1rem",
//   logoHoverColor: "#eb4034",
//   link1Text: "Home",
//   link2Text: "Products",
//   link3Text: "Contact",
//   link4Text: "About",
//   link1Url: "/",
//   link2Url: "/products",
//   link3Url: "/contact",
//   link4Url: "/about",
//   link1Size: "1rem",
//   link1Color: "rgba(35, 35, 35,0.8)",
//   nav1justifyContent: "flex-end",
//   nav2justifyContent: "flex-end",
//   nav3justifyContent: "flex-start",
//   nav4justifyContent: "flex-start",
//   link1ColorHover: "#eb4034",
//   link1Margin: "1rem",
//   profileIconUrl: "/login",
//   profileIconColor: "rgba(35, 35, 35,0.8)",
//   searchIconColor: "rgba(35, 35, 35,0.8)",
//   cartIconColor: "rgba(35, 35, 35,0.8)",
//   profileIconColorHover: "#eb4034",
//   searchIconColorHover: "#eb4034",
//   cartIconColorHover: "#eb4034",
//   cartIconMargin: "1rem",
// };

