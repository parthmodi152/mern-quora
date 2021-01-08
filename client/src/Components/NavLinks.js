import React from "react";
import { Home, Answer, Spaces, Notifications } from "../assets/index";
import { useHistory, useLocation, Link } from "react-router-dom";

const NavLinks = () => {
  let currentLocation = useLocation();
  let history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };
  return (
    <ul className="navLinks">
      <li
        onClick={() => handleClick("/")}
        className={
          currentLocation.pathname.length <= 1 ? "active-nav" : undefined
        }
      >
        <Home />
        Home
      </li>
      <li
        onClick={() => handleClick("/answer")}
        className={
          currentLocation.pathname.includes("answer") ? "active-nav" : undefined
        }
      >
        <Answer />
        Answer
      </li>
      <li
        onClick={() => handleClick("/spaces")}
        className={
          currentLocation.pathname.includes("spaces") ? "active-nav" : undefined
        }
      >
        <Spaces />
        Spaces
      </li>
      <li
        onClick={() => handleClick("/notifications")}
        className={
          currentLocation.pathname.includes("notifications")
            ? "active-nav"
            : undefined
        }
      >
        <Notifications />
        Notifications
      </li>
    </ul>
  );
};

export default NavLinks;
