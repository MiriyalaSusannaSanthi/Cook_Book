const express = require("express");
const router = express.Router();
const { firebaseLogin } = require("../controllers/authController");

router.post("/firebase-login", firebaseLogin);

module.exports = router;