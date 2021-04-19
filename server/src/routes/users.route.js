const router = require("express").Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.getUsers);

router.get("/:_id", usersController.getUserByID);

router.post("/", usersController.handleUser);

// router.put("/:id", usersController.updateBook);

// router.delete("/:_id", usersController.removeBook);

module.exports = router;
