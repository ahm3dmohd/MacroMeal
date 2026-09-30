const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const MealItem = require("../models/MealItem.js");

router.get("/", async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" });
    res.render("vendors/vendorList.ejs", { vendors });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).render("404.ejs");
    }
    const mealItems = await MealItem.find({ vendor: vendor._id, available: true });
    res.render("vendors/vendorShow.ejs", { vendor, mealItems });
  } catch (error) {
    console.log(error);
    res.status(404).render("404.ejs");
  }
});

module.exports = router;
