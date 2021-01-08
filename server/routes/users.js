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
      res.send(`New User is Created`);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

// router.post("/login", async (req, res) => {});

module.exports = router;
