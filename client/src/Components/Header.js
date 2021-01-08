import React from "react";
import { QuoraLogo } from "../assets/index";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import NavSearch from "./NavSearch";
import Avatar from "@material-ui/core/Avatar";
import NavAddQuestionBtn from "./NavAddQuestionBtn";

const Header = () => {
  return (
    <div className="header">
      <a href="/">
        <QuoraLogo />
      </a>
      <NavLinks />
      <NavSearch />
      <Avatar
        alt="user avatar"
        src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
      />
      <NavAddQuestionBtn />
    </div>
  );
};

export default Header;
