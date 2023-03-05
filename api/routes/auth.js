const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {register, login, refreshToken} = require("../controllers/authController");
//REGISTER
router.post("/register", register);
//LOGIN
router.post("/login", login);
//refresh token
router.post("/refresh-token", refreshToken)

module.exports = router;
