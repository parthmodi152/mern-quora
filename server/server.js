const express = require("express");
const app = express();
const connectToDatabase = require("./config/connectToDatabase");
const cors = require("cors");
const morgan = require("morgan");

// Connects the app to database
connectToDatabase();

// This prevents the cors policy warning
app.use(cors());
app.use(morgan("dev"));

// Allows to use req.body as JSON
app.use(express.json({ extended: false }));

// Routes
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/users", require("./routes/users.js"));

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
