const express = require("express");
const router = express.Router();
const {
  createPostValidator,
  searchForPostValidator,
  addCommentValidator,
} = require("../middleware/express-validator/expressValidator");
const Post = require("../schemas/Post");
const authentication = require("../middleware/authentication");
let User = require("../schemas/User");
const { check, validationResult } = require("express-validator");
const getPosts = require("../functions/postFunctions/getPosts");
const getMostLikedPosts = require("../functions/postFunctions/getMostLikedPosts");
const getPostsByDate = require("../functions/postFunctions/getPostsByDate");
const getMostCommented = require("../functions/postFunctions/getMostCommented");
const getSinglePost = require("../functions/postFunctions/getSinglePost");
const getUserPostsById = require("../functions/postFunctions/getUserPostsById");
const getUserPostsByMiddleware = require("../functions/postFunctions/getUserPostsByMiddleware");
const searchForPost = require("../functions/postFunctions/searchForPost");
const createPost = require("../functions/postFunctions/createPost");

router.get("/all_posts", getPosts);

router.get("/most_liked", getMostLikedPosts);

router.get("/most_recent", getPostsByDate);

router.get("/most_commented", getMostCommented);

router.get("/find_post/:post_id", getSinglePost);

router.get("/user_posts/:user_id", getUserPostsById);

router.get("/user_posts", authentication, getUserPostsByMiddleware);

router.post("/", authentication, createPostValidator, createPost);

router.put("/search_for_post", searchForPostValidator, searchForPost);

module.exports = router;
