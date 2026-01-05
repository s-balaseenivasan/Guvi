const express = require("express");
const router = express.Router();

const { forgotpassword, register, resetpassword, login } = require("../service/services");

/* FORGOT PASSWORD */
router.post("/forgot-password", forgotpassword);

/* REGISTER USER */
router.post("/register", register);

/* RESET PASSWORD */
router.post("/reset-password/:token", resetpassword);

/* LOGIN USER */
router.post("/login", login);

module.exports = router;
