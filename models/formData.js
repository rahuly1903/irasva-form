const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  formData: {
    type: Object,   // single object field to hold full form data
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FormData", formDataSchema);