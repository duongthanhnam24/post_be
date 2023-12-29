const express = require("express");
const router = express.Router();
const UserController = require("../app/controlers/userController");
const { authUserMiddleWare } = require("../app/Middleware/authMiddleware");
router.post("/sign-up", UserController.createUser);
router.post("/login", UserController.SignIn);
router.get("/all", UserController.GetAllUser);
router.get("/profile/:id", authUserMiddleWare, UserController.getUser);
module.exports = router;
