const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const isAdmin = require("../middleware/is-admin.js");
const User = require("../models/User.js");

router.get("/", isSignedIn, isAdmin, (req, res) => {
  res.render("admin/dashboard.ejs");
});

router.get("/users", isSignedIn, isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render("admin/users.ejs", { users });
});

router.put("/users/:id/role", isSignedIn, isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
  res.redirect("/admin/users");
});

module.exports = router;
