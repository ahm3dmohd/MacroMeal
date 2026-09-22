const express = require("express");
const router = express.Router();
const MealItem = require("../models/MealItem.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
  const mealItems = await MealItem.find({ available: true }).populate("vendor");
  res.render("mealitems/index.ejs", { mealItems });
});

module.exports = router;