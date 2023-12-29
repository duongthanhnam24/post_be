const express = require("express");
const router = express.Router();
const Transaction = require("../app/controlers/transactionController");

router.patch("/update-user/:id", Transaction.upDate);
router.patch("/send-note/:id/:idGathering", Transaction.sendGathering);
router.post("/create", Transaction.createTransaction);
router.get("/get-all", Transaction.allTransaction);
router.get("/get/:id", Transaction.getTransactionById);

module.exports = router;
