const app = require("express")();
const PORT = process.env.PORT || 3001;

const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const booksRouter = require("./routes/books.route");
const usersRoute = require("./routes/users.route");
const callCardsRoute = require("./routes/callCards.route");

const uri =
  "mongodb+srv://xuanminh4987:Minh1751010088@cluster0.hat8c.mongodb.net/QuanLyThueSach?retryWrites=true&w=majority";

app.use(cors());
app.use(bodyParser());
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;

    console.log("MONGODB CONNECTED!");
  }
);

app.get("/", (req, res) => {
  res.redirect("*");
});

app.use("/books", booksRouter);

app.use("/users", usersRoute);

app.use("/call-cards", callCardsRoute);

app.get("*", (req, res) => {
  res.send("404 NOT FOUND!");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
