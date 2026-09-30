const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const isAdmin = require("../middleware/is-admin.js");

router.get("/", isSignedIn, isAdmin, (req, res) => {
  res.render("admin/dashboard.ejs");
});

module.exports = router;
