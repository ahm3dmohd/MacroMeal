const express = require("express");
const router = express.Router();
const MealItem = require("../models/MealItem.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
  try {
    const mealItems = await MealItem.find({ available: true }).populate("vendor");
    res.render("mealItems/mealMainPage.ejs", { mealItems });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/new", isSignedIn, (req, res) => {
  if (req.session.user.role !== "vendor" && req.session.user.role !== "admin") {
    return res.send("Only vendors can create meal items.");
  }
  res.render("mealItems/mealCreate.ejs");
});

router.get("/dashboard", isSignedIn, async (req, res) => {
  try {
    if (req.session.user.role !== "vendor" && req.session.user.role !== "admin") {
      return res.send("Only vendors can view a dashboard.");
    }
    const mealItems = await MealItem.find({ vendor: req.session.user._id });
    res.render("mealItems/vendorDash.ejs", { mealItems });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.post("/", isSignedIn, async (req, res) => {
  try {
    if (req.session.user.role !== "vendor" && req.session.user.role !== "admin") {
      return res.send("Only vendors can create meal items.");
    }
    req.body.vendor = req.session.user._id;
    req.body.available = req.body.available === "on";
    await MealItem.create(req.body);
    res.redirect("/mealitems");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const mealItem = await MealItem.findById(req.params.id).populate("vendor");
    if (!mealItem) {
      return res.status(404).render("404.ejs");
    }
    res.render("mealItems/mealShow.ejs", { mealItem });
  } catch (error) {
    console.log(error);
    res.status(404).render("404.ejs");
  }
});

router.get("/:id/edit", isSignedIn, async (req, res) => {
  try {
    const mealItem = await MealItem.findById(req.params.id);
    if (!mealItem) {
      return res.status(404).render("404.ejs");
    }
    if (!mealItem.vendor.equals(req.session.user._id)) {
      return res.send("You are not authorized to edit this meal item.");
    }
    res.render("mealItems/mealEdit.ejs", { mealItem });
  } catch (error) {
    console.log(error);
    res.status(404).render("404.ejs");
  }
});

router.put("/:id", isSignedIn, async (req, res) => {
  try {
    const mealItem = await MealItem.findById(req.params.id);
    if (!mealItem) {
      return res.status(404).render("404.ejs");
    }
    if (!mealItem.vendor.equals(req.session.user._id)) {
      return res.send("You are not authorized to update this meal item.");
    }
    req.body.available = req.body.available === "on";
    await mealItem.updateOne(req.body);
    res.redirect(`/mealitems/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

router.delete("/:id", isSignedIn, async (req, res) => {
  try {
    const mealItem = await MealItem.findById(req.params.id);
    if (!mealItem) {
      return res.status(404).render("404.ejs");
    }
    const isOwner = mealItem.vendor.equals(req.session.user._id);
    const isAdmin = req.session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.send("You are not authorized to delete this meal item.");
    }
    await mealItem.deleteOne();
    res.redirect("/mealitems");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
