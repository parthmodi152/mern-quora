const express = require("express");
const router = express.Router();
let User = require("../schemas/User");
const authentication = require("../middleware/authentication");
const getUserByMiddleware = require("../functions/userFunctions/getUserByMiddleware");
const getUserByEmail = require("../functions/userFunctions/getUserByEmail");
const getUsers = require("../functions/userFunctions/getUsers");
const getUserById = require("../functions/userFunctions/getUserById");
const registerUser = require("../functions/userFunctions/registerUser");
const loginUser = require("../functions/userFunctions/loginUser");
const {
  registerUserValidator,
  loginUserValidator,
  searchUserByUsernameValidator,
  changeUserDataValidator,
  checkActualPasswordValidator,
  changeUserPasswordValidator,
} = require("../middleware/express-validator/expressValidator");
const searchUserByUsername = require("../functions/userFunctions/searchUserByUsername");
const changeUserData = require("../functions/userFunctions/changeUserData");
const checkActualPassword = require("../functions/userFunctions/checkActualPassword");
const changeUserPassword = require("../functions/userFunctions/changeUserPassword");

router.get("/", authentication, getUserByMiddleware);

router.get("/all_users", getUsers);

router.get("/get_user_by_email/:user_email", getUserByEmail);

router.get("/get_user_by_id/:user_id", getUserById);

router.post("/register", registerUserValidator, registerUser);

router.post("/login", loginUserValidator, loginUser);

router.post(
  "/search_by_username",
  searchUserByUsernameValidator,
  searchUserByUsername
);

router.put(
  "/change_user_data/:user_data_to_change",
  authentication,
  changeUserDataValidator,
  changeUserData
);

router.put(
  "/check_actual_password",
  authentication,
  checkActualPasswordValidator,
  checkActualPassword
);

router.put(
  "/change_user_password",
  authentication,
  changeUserPasswordValidator,
  changeUserPassword
);

module.exports = router;
