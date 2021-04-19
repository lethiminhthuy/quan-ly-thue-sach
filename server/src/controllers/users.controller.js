const Users = require("../models/users.model");

module.exports.getUsers = async (req, res) => {
  const users = await Users.find({});
  if (users) {
    return res.json({
      status: "success",
      data: users,
    });
  }

  return res.json({
    status: "error",
    msg: "Không tìm thấy.",
  });
};

module.exports.getUserByID = async (req, res) => {
  const { _id } = req.params;
  const user = await Users.findOne({ _id });
  if (user) {
    return res.json({
      status: "success",
      data: user,
    });
  }

  return res.json({
    status: "error",
    msg: "Không tìm thấy.",
  });
};

module.exports.handleUser = async (req, res) => {
  const { type, userInfo } = req.body;
  const { username, password } = userInfo;
  if ((!username, !password)) {
    return res.json({
      status: "error",
      msg: "Nhập thiếu thông tin cần thiết.",
    });
  }

  if (type === "signin") {
    const user = await Users.findOne({ username });
    if (user) {
      if (user.password === password) {
        return res.json({
          status: "success",
          data: user,
        });
      }

      return res.json({
        status: "error",
        msg: "Mật khẩu không đúng.",
      });
    }

    return res.json({
      status: "error",
      msg: "Tài khoản không tồn tại.",
    });
  }

  if (type === "signup") {
    const user = await Users.findOne({ username });
    if (!user) {
      const newUser = new Users(userInfo);
      newUser.save();

      return res.json({
        status: "success",
        data: newUser,
      });
    }

    return res.json({
      status: "error",
      msg: "Tài khoản đã tồn tại.",
    });
  }
};
