const express = require("express");
const router = express.Router();
const Note = require("../app/controlers/noteController");

router.patch("/:id/:idOb", Note.editNote);
router.get("/get/:id", Note.findNote);
module.exports = router;
