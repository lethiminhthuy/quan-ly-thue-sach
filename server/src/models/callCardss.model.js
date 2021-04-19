const mongoose = require("mongoose");

const CallCards = mongoose.model(
  "call-card",
  {
    name: String,
    email: String,
    gender: String,
    age: Number,
    phone: String,
    date: Array,
    books: Array,
  },
  "call-cards"
);

module.exports = CallCards;
