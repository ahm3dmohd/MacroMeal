const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  mealItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MealItem",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
}, {_id: false});

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: {
    type: [orderItemSchema],
    validate: [items => items.length > 0, "Order must contain at least one item"]
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered"],
    default: "pending"
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
