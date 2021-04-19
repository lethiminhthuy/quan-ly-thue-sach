const router = require("express").Router();
const booksController = require("../controllers/books.controller");

router.get("/", booksController.getBooks);

router.get("/:_id", booksController.getBookByID);

router.post("/", booksController.addBook);

router.put("/:_id", booksController.updateBook);

router.delete("/:_id", booksController.removeBook);

module.exports = router;
