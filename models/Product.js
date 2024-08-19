const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true, // Primary Key
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    amount: {
      type: Number,
    },
    code: {
      type: String,
    },
    description: {
      type: String,
    },
    lastUpdated: {
      type: Date,
    },
    oldMRP: {
      type: Number,
      default: 0,
    },
    discont: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
