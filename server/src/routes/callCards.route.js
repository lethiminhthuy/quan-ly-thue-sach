const router = require("express").Router();
const callCardsController = require("../controllers/callCards.controller");

router.get("/", callCardsController.getCallCards);

router.get("/:_id", callCardsController.getCallCardById);

router.post("/", callCardsController.createCallCard);

router.put("/:_id", callCardsController.updateCallCard);

router.delete("/:_id", callCardsController.removedCallCard);

module.exports = router;
