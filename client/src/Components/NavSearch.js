import React from "react";
import { Magnifier } from "../assets/index";

const NavSearch = () => {
  return (
    <div className="nav-search">
      <Magnifier />
      <input type="text" placeholder="Search Quora" />
    </div>
  );
};

export default NavSearch;
