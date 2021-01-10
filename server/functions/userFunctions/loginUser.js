const { validationResult } = require("express-validator");
const User = require("../../schemas/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async (req, res) => {
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
};
