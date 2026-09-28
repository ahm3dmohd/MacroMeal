const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const MealItem = require("../models/MealItem.js");

router.get("/", async (req, res) => {
  const vendors = await User.find({ role: "vendor" });
  res.render("vendors/vendorList.ejs", { vendors });
});

router.get("/:id", async (req, res) => {
  const vendor = await User.findById(req.params.id);
  if (!vendor || vendor.role !== "vendor") {
    return res.send("Vendor not found.");
  }
  const mealItems = await MealItem.find({ vendor: vendor._id, available: true });
  res.render("vendors/vendorShow.ejs", { vendor, mealItems });
});

module.exports = router;