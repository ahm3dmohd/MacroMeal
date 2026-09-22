const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});

const MealItem = mongoose.model("MealItem", mealItemSchema);

module.exports = MealItem;
