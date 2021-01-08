import React, { useState } from "react";
import { QuoraLogo } from "../assets/index";

const Login = () => {
  const [SignUpClicked, setSignUpClicked] = useState(false);
  const signupForm = () => {
    return (
      <div className="left-forms">
        <form method="POST" className="starter-forms login-form">
          <div className="form-title">Sign Up</div>
          <div className="form-inputs">
            <div className="half-form-inputs">
              <div className="first-name-half half">
                <div className="input-box">
                  <label>First Name</label>
                  <input type="text" name="first_name"></input>
                </div>
              </div>
              <div className="last-name-half half">
                <div className="input-box">
                  <label>Last Name</label>
                  <input type="text" name="last_name"></input>
                </div>
              </div>
            </div>
            <div className="input-box">
              <label>EMAIL</label>
              <input type="text" name="email"></input>
            </div>
            <div className="input-box">
              <label>PASSWORD</label>
              <input type="password" name="password"></input>
            </div>
          </div>
          <div className="submit-btn-div">
            <a href="#" className="cancel">
              Cancel
            </a>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="login">
      <div className="login-form-div">
        <div className="logo"></div>
        <h2 className="tagline">
          A place to share knowledge and better understand the world
        </h2>
        <div className="forms">
          {signupForm()}
          <div className="right-forms">
            <form method="POST" className="starter-forms login-form">
              <div className="form-title">Login</div>
              <div className="form-inputs">
                <div className="input-box">
                  <input type="text" name="email" placeholder="Email"></input>
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                  ></input>
                </div>
              </div>
              <div className="submit-btn-div">
                <a href="#" className="forgot_password">
                  Forgot Password?
                </a>
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
