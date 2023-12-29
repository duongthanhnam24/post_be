const express = require("express");
const router = express.Router();
const Gathering = require("../app/controlers/gatheringController");

router.patch("/send-gathering/:id/:gathering", Gathering.sendToGathering);
router.patch("/send-note/:id/:gathering", Gathering.sendTotransactionPoint);
router.patch("/add-note/:id", Gathering.createNoteandAddtoGathering);
router.patch("/update/:id", Gathering.upDate);
router.post("/new", Gathering.createGathering);
router.get("/get/:id", Gathering.getGatheringId);
router.get("/all", Gathering.getAll);

module.exports = router;
