const mongoose = require("mongoose");

const Books = mongoose.model(
  "book",
  {
    name: String,
    description: String,
    thumbnail: String,
    rentInfo: {
      isRented: Boolean,
      renter: String,
    },
    status: Boolean,
  },
  "books"
);

module.exports = Books;
