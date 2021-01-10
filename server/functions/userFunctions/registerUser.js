const { AvatarGenerator } = require("random-avatar-generator");
const generator = new AvatarGenerator();
const User = require("../../schemas/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");

module.exports = async (req, res) => {
  try {
    let { name, lastName, userName, email, password } = req.body;
    let similarEmailUser = await User.findOne({ email }).select("-password");
    let similarUserNameUser = await User.findOne({ email }).select("-password");
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
};
