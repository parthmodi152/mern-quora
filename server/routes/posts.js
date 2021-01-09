const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(`WASSUP BRUHBRUHBRUHBRUH`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
