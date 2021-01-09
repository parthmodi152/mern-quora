const config = require("config");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
let User = require("../schemas/User");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { AvatarGenerator } = require("random-avatar-generator");
const generator = new AvatarGenerator();
const authentication = require("../middleware/authentication");

router.get("/", authentication, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/get_user_by_email/:user_email", async (req, res) => {
  try {
    let userEmail = req.params.user_email;
    let user = await User.findOne({ email: userEmail }).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/get_user_by_id/:user_id", async (req, res) => {
  try {
    let userID = req.params.user_id;
    let user = await User.findById(userID).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/all_users", async (req, res) => {
  try {
    let users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

router.post(
  "/register",
  [
    check("name", "Name is empty").not().isEmpty(),
    check("lastName", "Last Name is empty").not().isEmpty(),
    check("userName", "Username is empty").not().isEmpty(),
    check("email", "E-mail is empty").isEmail(),
    check(
      "password",
      "Password needs to contain atleast 6 letters and at most 12"
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      let { name, lastName, userName, email, password } = req.body;
      let similarEmailUser = await User.findOne({ email }).select("-password");
      let similarUserNameUser = await User.findOne({ email }).select(
        "-password"
      );
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      if (similarEmailUser)
        return res.status(401).send(`User is already registered`);
      if (similarUserNameUser)
        return res.status(401).send(`Username is already in use`);

      //   const avatar = gravatar.url(email, {
      //     r: "pg",
      //     d: "mm",
      //     d: "200",
      //   });
      const avatar = generator.generateRandomAvatar();

      let newUser = new User({
        name,
        lastName,
        userName,
        email,
        password,
        avatar,
      });

      const salt = await bcryptjs.genSalt(10);
      let hashedPassword = await bcryptjs.hash(password, salt);

      newUser.password = hashedPassword;

      await newUser.save();

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(
        payload,
        config.get("jsonwebtokenSecretKey"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "E-mail is empty").isEmail(),
    check(
      "password",
      "Password needs to contain atleast 6 letters and at most 12"
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body;
      let similarEmailUser = await User.findOne({ email });
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      if (!similarEmailUser)
        return res
          .status(401)
          .send(`User is not already registered. Please Sign Up`);

      const payload = {
        user: {
          id: similarEmailUser._id,
        },
      };

      const doPasswordMatch = await bcryptjs.compare(
        password,
        similarEmailUser.password
      );

      if (!doPasswordMatch) return res.status(401).json("Password don't match");

      jwt.sign(
        payload,
        config.get("jsonwebtokenSecretKey"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/search_by_username",
  [check("userNameFromSearch", "Search is empty").not().isEmpty()],
  async (req, res) => {
    try {
      let errors = validationResult(req.body);
      let { userNameFromSearch } = req.body;
      let users = await User.find().select("-password");

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      let findUserByUsername = users.filter(
        (user) =>
          user.userName.toString().toLowerCase().split(" ").join("") ===
          userNameFromSearch.toString().toLowerCase().split(" ").join("")
      );
      res.json(findUserByUsername);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/change_user_data/:user_data_to_change",
  authentication,
  [check("changeUserData", "Input is empty").not().isEmpty()],
  async (req, res) => {
    try {
      let errors = validationResult(req.body);
      const { changeUserData } = req.body;
      let user = await User.findById(req.user.id).select("-password");

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      if (!user) return res.status(404).send(`User not found`);

      //   userDataToChange -> name, lastName, userName, email
      let userDataToChange = req.params.user_data_to_change.toString();
      if (user[userDataToChange] === changeUserData.toString())
        return res
          .status(401)
          .json(`This is the same data that is aready in database.`);

      user[userDataToChange] = changeUserData.toString();

      await user.save();

      res.json(user);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/check_actual_password",
  authentication,
  [
    check(
      "passwordToCheck",
      "Password needs to contain atleast 6 letters and at most 12"
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      const { passwordToCheck } = req.body;
      let errors = validationResult(req.body);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      let user = await User.findById(req.user.id);

      const doPasswordMatch = await bcryptjs.compare(
        passwordToCheck,
        user.password
      );

      if (!doPasswordMatch) return res.status(401).json("Password don't match");

      res.json("Success");
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/change_user_password",
  authentication,
  [
    check(
      "newPassword",
      "New Password needs to contain atleast 6 letters and at most 12"
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      let errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      let user = await User.findById(req.user.id);

      const salt = await bcryptjs.genSalt(10);

      const hashedPassword = await bcryptjs.hash(newPassword, salt);

      user.password = hashedPassword;

      await user.save();

      res.json(`Success`);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
