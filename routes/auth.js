const { register } = require("../controller/auth.controller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login");

module.exports = router;