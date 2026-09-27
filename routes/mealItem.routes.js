const express = require("express");
const router = express.Router();
const MealItem = require("../models/MealItem.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
  const mealItems = await MealItem.find({ available: true }).populate("vendor");
  res.render("mealItems/mealMainPage.ejs", { mealItems });
});


router.get("/new", isSignedIn, (req, res) => {
  if (req.session.user.role !== "vendor" && req.session.user.role !== "admin") {
    return res.send("Only vendors can create meal items.");
  }
  res.render("mealItems/mealCreate.ejs");
});

router.post("/", isSignedIn, async (req, res) => {
  if (req.session.user.role !== "vendor" && req.session.user.role !== "admin") {
    return res.send("Only vendors can create meal items.");
  }
  req.body.vendor = req.session.user._id;
  req.body.available = req.body.available === "on";
  await MealItem.create(req.body);
  res.redirect("/mealitems");
});

router.get("/:id", async (req, res) => {
  const mealItem = await MealItem.findById(req.params.id).populate("vendor");
  res.render("mealItems/mealShow.ejs", { mealItem });
});

router.get("/:id/edit", isSignedIn, async (req, res) => {
  const mealItem = await MealItem.findById(req.params.id);
  if (!mealItem.vendor.equals(req.session.user._id)) {
    return res.send("You are not authorized to edit this meal item.");
  }
  res.render("mealItems/mealEdit.ejs", { mealItem });
});

router.put("/:id", isSignedIn, async (req, res) => {
  const mealItem = await MealItem.findById(req.params.id);
  if (!mealItem.vendor.equals(req.session.user._id)) {
    return res.send("You are not authorized to update this meal item.");
  }
  req.body.available = req.body.available === "on";
  await mealItem.updateOne(req.body);
  res.redirect(`/mealitems/${req.params.id}`);
});

router.delete("/:id", isSignedIn, async (req, res) => {
  const mealItem = await MealItem.findById(req.params.id);
  const isOwner = mealItem.vendor.equals(req.session.user._id);
  const isAdmin = req.session.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.send("You are not authorized to delete this meal item.");
  }
  await mealItem.deleteOne();
  res.redirect("/mealitems");
});


module.exports = router;
