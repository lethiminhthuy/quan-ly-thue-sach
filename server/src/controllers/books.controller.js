const Books = require("../models/books.model");

module.exports.getBooks = async (req, res) => {
  const books = await Books.find({});
  if (books) {
    return res.json({
      isSuccess: true,
      data: books,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy!",
  });
};

module.exports.getBookByID = async (req, res) => {
  const { _id } = req.params;

  const book = await Books.findOne({ _id });
  if (book) {
    return res.json({
      isSuccess: true,
      data: book,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy!",
  });
};

module.exports.addBook = async (req, res) => {
  const { name, description, thumbnail } = req.body;

  if (!name || !description || !thumbnail) {
    return res.json({
      isSuccess: false,
      msg: "Điền thiếu thông tin.",
    });
  }

  let book = new Books({
    name,
    description,
    thumbnail,
    status: true,
    rentInfo: {
      isRented: false,
      renter: {},
    },
  });

  book = await book.save();
  if (book) {
    return res.json({
      isSuccess: true,
      data: book,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không thành công!",
  });
};

module.exports.updateBook = async (req, res) => {
  const { _id } = req.params;
  const { type, data } = req.body;

  let book = await Books.findOne({ _id });
  if (book) {
    if (type === "rent") {
      book.rentInfo = data.rentInfo;
      book = await book.save();

      return res.json({
        isSuccess: true,
        data: book,
      });
    }

    if (type === "info") {
      book.name = data.name;
      book.thumbnail = data.thumbnail;
      book.description = data.description;
      book = await book.save();

      return res.json({
        isSuccess: true,
        data: book,
      });
    }
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy.",
  });
};

module.exports.removeBook = async (req, res) => {
  const { _id } = req.params;

  let book = await Books.findOne({ _id });
  if (book) {
    book.status = false;
    book = await book.save();

    return res.json({
      isSuccess: true,
      data: book,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy!",
  });
};
