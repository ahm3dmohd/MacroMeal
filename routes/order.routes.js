const express = require("express")
const router = express.Router()
const Order = require("../models/Order.js")
const MealItem = require("../models/MealItem.js")
const isSignedIn = require("../middleware/is-signed-in.js")

router.get("/", isSignedIn, async (req, res) => {
  const orders = await Order.find({ owner: req.session.user._id }).sort({ createdAt: -1 });
  res.render("orders/orderMainPage.ejs", { orders });
});

router.get("/new", isSignedIn, async (req, res) => {
  const mealItems = await MealItem.find({ available: true });
  res.render("orders/orderCreate.ejs", { mealItems });
});

module.exports = router;