const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const isAdmin = require("../middleware/is-admin.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js");

router.get("/", isSignedIn, isAdmin, (req, res) => {
  res.render("admin/dashboard.ejs");
});

router.get("/users", isSignedIn, isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render("admin/users.ejs", { users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.put("/users/:id/role", isSignedIn, isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
    if (!updatedUser) {
      return res.status(404).render("404.ejs");
    }
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/orders", isSignedIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("owner").sort({ createdAt: -1 });
    res.render("admin/orders.ejs", { orders });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.put("/orders/:id/status", isSignedIn, isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    if (!updatedOrder) {
      return res.status(404).render("404.ejs");
    }
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
