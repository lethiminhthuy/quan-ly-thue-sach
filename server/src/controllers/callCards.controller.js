const CallCards = require("../models/callCardss.model");

module.exports.getCallCards = async (req, res) => {
  const callCards = await CallCards.find({});
  if (callCards) {
    return res.json({
      isSuccess: true,
      data: callCards,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy.",
  });
};

module.exports.getCallCardById = async (req, res) => {
  const { _id } = req.params;

  const callCard = await CallCards.findOne({ _id });
  if (callCard) {
    return res.json({
      isSuccess: true,
      data: callCard,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy.",
  });
};

module.exports.createCallCard = async (req, res) => {
  const { name, email, age, gender, phone, date, books } = req.body;

  if (!name || !email || !age || !gender || !phone || !date || !books) {
    return res.json({
      isSuccess: false,
      msg: "Không tìm thấy.",
    });
  }

  const callCardByEmail = await CallCards.findOne({ email });
  if (callCardByEmail) {
    return res.json({
      isSuccess: false,
      msg: "Đã tồn tại.",
    });
  }

  const callCard = new CallCards({
    name,
    email,
    age,
    gender,
    phone,
    date,
    books,
  });
  await callCard.save();

  return res.json({
    isSuccess: true,
    data: callCard,
  });
};

module.exports.updateCallCard = async (req, res) => {
  const { _id } = req.params;
  const {
    type,
    data: { name, email, age, gender, phone, date, books },
  } = req.body;

  if (!name || !email || !age || !gender || !phone || !date || !books) {
    return res.json({
      isSuccess: false,
      msg: "Không đủ thông tin.",
    });
  }

  let callCard = await CallCards.findOne({ _id });
  if (callCard) {
    if (type === "update") {
      callCard.name = name;
      callCard.books = books;
      callCard.age = age;
      callCard.email = email;
      callCard.date = date;
      callCard.phone = phone;
      callCard.gender = gender;

      const updatedCallCard = await callCard.save();
      if (updatedCallCard) {
        return res.json({
          isSuccess: true,
          data: updatedCallCard,
        });
      }

      return res.json({
        isSuccess: false,
        msg: "Không thể cập nhật.",
      });
    }
  }
};

module.exports.removedCallCard = async (req, res) => {
  const { _id } = req.params;

  const callCard = await CallCards.deleteOne({ _id });
  if (callCard) {
    return res.json({
      isSuccess: true,
      data: callCard,
    });
  }

  return res.json({
    isSuccess: false,
    msg: "Không tìm thấy.",
  });
};
