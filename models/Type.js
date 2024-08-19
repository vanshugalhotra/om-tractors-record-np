const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    default: "#fffff",
  },
});

const Type = mongoose.models.Type || mongoose.model("Type", typeSchema);
module.exports = Type;
