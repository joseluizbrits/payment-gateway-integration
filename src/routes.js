const express = require("express");
const router = express.Router();

const cartController = require("./controllers/cartController");
const transactionController = require("./controllers/transactionController");

router.get("/cart", cartController.index);
router.post("/cart", cartController.create);
router.put("/cart/:id", cartController.update);
router.delete("/cart/:id", cartController.detroy);

router.post("/transaction", transactionController.create);

module.exports = router;
