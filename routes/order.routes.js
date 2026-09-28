const express = require("express")
const router = express.Router()
const Order = require("../models/Order.js")
const MealItem = require("../models/MealItem.js")
const isSignedIn = require("../middleware/is-signed-in.js")

router.get("/", isSignedIn, async (req, res) => {
  const orders = await Order.find({ owner: req.session.user._id }).sort({ createdAt: -1 });
  res.render("orders/orderMainMenu.ejs", { orders });
});

router.get("/new", isSignedIn, async (req, res) => {
  const mealItems = await MealItem.find({ available: true });
  res.render("orders/orderCreate.ejs", { mealItems });
});

router.post("/", isSignedIn, async (req, res) => {
  const mealItemIds = [].concat(req.body.mealItemIds || []);
  const quantities = [].concat(req.body.quantities || []);

  const items = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalPrice = 0;

  for (let i = 0; i < mealItemIds.length; i++) {
    const quantity = Number(quantities[i]);
    if (!quantity || quantity < 1) continue;

    const mealItem = await MealItem.findById(mealItemIds[i]);
    if (!mealItem) continue;

    items.push({ mealItem: mealItem._id, quantity });

    totalCalories += mealItem.calories * quantity;
    totalProtein += mealItem.protein * quantity;
    totalCarbs += mealItem.carbs * quantity;
    totalFat += mealItem.fat * quantity;
    totalPrice += mealItem.price * quantity;
  }

  if (items.length === 0) {
    return res.send("Please select at least one meal item with a quantity of 1 or more.");
  }

  await Order.create({
    owner: req.session.user._id,
    items,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalPrice
  });

  res.redirect("/orders");
});


// this is for the owner only.
router.get("/:id", isSignedIn, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.mealItem");
  if (!order.owner.equals(req.session.user._id)) {
    return res.send("You are not authorized to view this order.");
  }
  res.render("orders/orderShow.ejs", { order });
}); 

// EDIT - owner only, pre-fill existing quantities
router.get("/:id/edit", isSignedIn, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order.owner.equals(req.session.user._id)) {
    return res.send("You are not authorized to edit this order.");
  }
  const mealItems = await MealItem.find({ available: true });

  const quantityMap = {};
  order.items.forEach((item) => {
    quantityMap[item.mealItem.toString()] = item.quantity;
  });

  res.render("orders/orderEdit.ejs", { order, mealItems, quantityMap });
});

// UPDATE - owner only, recalculate totals
router.put("/:id", isSignedIn, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order.owner.equals(req.session.user._id)) {
    return res.send("You are not allowed to update this order.");
  }

  const mealItemIds = [].concat(req.body.mealItemIds || []);
  const quantities = [].concat(req.body.quantities || []);

  const items = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalPrice = 0;

  for (let i = 0; i < mealItemIds.length; i++) {
    const quantity = Number(quantities[i]);
    if (!quantity || quantity < 1) continue;

    const mealItem = await MealItem.findById(mealItemIds[i]);
    if (!mealItem) continue;

    items.push({ mealItem: mealItem._id, quantity });

    totalCalories += mealItem.calories * quantity;
    totalProtein += mealItem.protein * quantity;
    totalCarbs += mealItem.carbs * quantity;
    totalFat += mealItem.fat * quantity;
    totalPrice += mealItem.price * quantity;
  }

  if (items.length === 0) {
    return res.send("Please select at least one meal item with a quantity of 1 or more.");
  }

  order.items = items;
  order.totalCalories = totalCalories;
  order.totalProtein = totalProtein;
  order.totalCarbs = totalCarbs;
  order.totalFat = totalFat;
  order.totalPrice = totalPrice;
  await order.save();

  res.redirect(`/orders/${req.params.id}`);
});

// DELETE - owner only
router.delete("/:id", isSignedIn, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order.owner.equals(req.session.user._id)) {
    return res.send("You are not authorized to delete this order.");
  }
  await order.deleteOne();
  res.redirect("/orders");
});


module.exports = router;